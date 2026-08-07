package com.project.base.services.impl;

import com.project.base.dto.DealResponseDTO;
import com.project.base.pojo.*;
import com.project.base.repository.CarRepository;
import com.project.base.repository.DealRepository;
import com.project.base.services.DealService;
import com.project.base.services.DepositPolicy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DealServiceImpl implements DealService {
	
	@Autowired
    private CarRepository carRepo;

    @Autowired
    private com.project.base.repository.UserRepository userRepo;

    @Autowired
    private com.project.base.repository.UserSubscriptionRepository userSubRepo;
	
    @Autowired
    private DealRepository dealRepo;

    @Override
    @Transactional
    public Deal createDealForAuctionWin(Auction auction, Bid winningBid) {
        Car car = auction.getCar();

        Deal deal = new Deal();
        deal.setDealType(DealType.AUCTION_WIN);
        deal.setCar(car);
        deal.setBuyer(winningBid.getBidder());
        deal.setAuction(auction);
        deal.setAgreedPrice(winningBid.getBidAmount());
        deal.setDepositAmount(DepositPolicy.getDepositAmount(car.getVehicleCategory()));
        deal.setSellerConfirmDeadline(LocalDateTime.now().plusHours(24));
        deal.setDepositDeadline(LocalDateTime.now().plusHours(24));
        deal.setStatus(DealStatus.PENDING);

        return dealRepo.save(deal);
    }
    
    @Override
    @Transactional
    public Deal createDealForDirectSale(Long carId, Long buyerId) {
        Car car = carRepo.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        if (car.getSaleType() != SaleType.DIRECT) {
            throw new RuntimeException("This car is not listed for direct sale");
        }
        if (car.getStatus() != Status.AVAILABLE) {
            throw new RuntimeException("This car is no longer available");
        }
        if (car.getSeller().getId().equals(buyerId)) {
            throw new RuntimeException("You cannot buy your own listing");
        }

        User buyer = userRepo.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean hasActiveSub = userSubRepo.findFirstByUserAndStatus(buyer, SubscriptionStatus.ACTIVE).isPresent();
        if (!hasActiveSub) {
            throw new RuntimeException("An active subscription is required to purchase a car");
        }

        if (dealRepo.findByCarIdAndStatus(carId, DealStatus.PENDING).isPresent()) {
            throw new RuntimeException("This car already has a purchase in progress");
        }

        Deal deal = new Deal();
        deal.setDealType(DealType.DIRECT_SALE);
        deal.setCar(car);
        deal.setBuyer(buyer);
        deal.setAgreedPrice(BigDecimal.valueOf(car.getPrice()));
        deal.setDepositAmount(DepositPolicy.getDepositAmount(car.getVehicleCategory()));

        // No seller-confirm step for direct sale — the seller already agreed by listing it
        deal.setSellerConfirmation(SellerConfirmation.CONFIRMED);
        deal.setSellerConfirmDeadline(LocalDateTime.now()); // unused for this path, but column is NOT NULL
        deal.setDepositDeadline(LocalDateTime.now().plusHours(24)); // reservation window
        deal.setStatus(DealStatus.PENDING);

        Deal saved = dealRepo.save(deal);

        car.setStatus(Status.RESERVED);
        carRepo.save(car);

        return saved;
    }
    
    @Override
    @Transactional(readOnly = true)
    public DealResponseDTO getDealById(Long dealId, Long requesterId) {
        Deal deal = dealRepo.findById(dealId)
                .orElseThrow(() -> new RuntimeException("Deal not found"));

        boolean isBuyer = deal.getBuyer().getId().equals(requesterId);
        boolean isSeller = deal.getCar().getSeller().getId().equals(requesterId);
        if (!isBuyer && !isSeller) {
            throw new RuntimeException("You are not authorized to view this deal");
        }

        return mapToDto(deal);
    }
    
    @Override
    @Transactional
    public void sellerConfirm(Long dealId, Long sellerId) {
        Deal deal = dealRepo.findById(dealId)
                .orElseThrow(() -> new RuntimeException("Deal not found"));

        if (!deal.getCar().getSeller().getId().equals(sellerId)) {
            throw new RuntimeException("You are not authorized to act on this deal");
        }
        if (deal.getStatus() != DealStatus.PENDING) {
            throw new RuntimeException("This deal has already been resolved");
        }
        if (deal.getSellerConfirmation() != SellerConfirmation.PENDING) {
            throw new RuntimeException("You have already responded to this deal");
        }

        deal.setSellerConfirmation(SellerConfirmation.CONFIRMED);
        dealRepo.save(deal);

        tryUnlock(deal);
    }

    @Override
    @Transactional
    public void sellerDecline(Long dealId, Long sellerId) {
        Deal deal = dealRepo.findById(dealId)
                .orElseThrow(() -> new RuntimeException("Deal not found"));

        if (!deal.getCar().getSeller().getId().equals(sellerId)) {
            throw new RuntimeException("You are not authorized to act on this deal");
        }
        if (deal.getStatus() != DealStatus.PENDING) {
            throw new RuntimeException("This deal has already been resolved");
        }
        if (deal.getSellerConfirmation() != SellerConfirmation.PENDING) {
            throw new RuntimeException("You have already responded to this deal");
        }
        if (LocalDateTime.now().isAfter(deal.getSellerConfirmDeadline())) {
            throw new RuntimeException("Confirmation window has closed — this sale is locked in.");
        }

        deal.setSellerConfirmation(SellerConfirmation.DECLINED);
        deal.setStatus(DealStatus.DECLINED_BY_SELLER);
        dealRepo.save(deal);

        if (deal.isDepositPaid() && !deal.isDepositRefunded()) {
            // TODO (Stage 3): trigger actual Razorpay refund here via PaymentService,
            // then set deal.setDepositRefunded(true) once confirmed.
            System.out.println("⚠️ Refund needed for deal " + deal.getId() + " — Razorpay refund wiring pending (Stage 3)");
        }

        // Reopen the car so the seller can auction/list it again
        Car car = deal.getCar();
        car.setStatus(Status.AVAILABLE);
        carRepo.save(car);
    }

    private void tryUnlock(Deal deal) {
        if (deal.getSellerConfirmation() == SellerConfirmation.CONFIRMED
                && deal.isDepositPaid()
                && deal.getStatus() == DealStatus.PENDING) {

            deal.setStatus(DealStatus.CONTACT_UNLOCKED);
            dealRepo.save(deal);

            Car car = deal.getCar();
            car.setStatus(Status.SOLD);
            carRepo.save(car);
        }
    }

    @Override
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void resolveExpiredDeals() {
        LocalDateTime now = LocalDateTime.now();

        // Silence = confirmed (this is the "can't back out" enforcement)
        List<Deal> silentSellers = dealRepo.findByStatusAndSellerConfirmDeadlineBefore(DealStatus.PENDING, now);
        for (Deal deal : silentSellers) {
            if (deal.getSellerConfirmation() == SellerConfirmation.PENDING) {
                deal.setSellerConfirmation(SellerConfirmation.CONFIRMED);
                dealRepo.save(deal);
                tryUnlock(deal);
                System.out.println("🔒 Deal " + deal.getId() + " auto-confirmed (seller silent past 24h)");
            }
        }

        // Buyer failed to pay in time → forfeit
        List<Deal> missedDeposits = dealRepo.findByStatusAndDepositDeadlineBefore(DealStatus.PENDING, now);
        for (Deal deal : missedDeposits) {
            if (!deal.isDepositPaid()) {
                deal.setStatus(DealStatus.FORFEITED);
                dealRepo.save(deal);

                Car car = deal.getCar();
                car.setStatus(Status.AVAILABLE);
                carRepo.save(car);

                System.out.println("❌ Deal " + deal.getId() + " forfeited — buyer missed deposit deadline");
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<DealResponseDTO> getMyDealsAsBuyer(Long buyerId) {
        return dealRepo.findByBuyerId(buyerId).stream().map(this::mapToDto).collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public void markDepositPaid(Long dealId, String razorpayPaymentId) {
        Deal deal = dealRepo.findById(dealId)
                .orElseThrow(() -> new RuntimeException("Deal not found"));

        if (deal.getStatus() != DealStatus.PENDING) {
            throw new RuntimeException("This deal is no longer accepting payment (status: " + deal.getStatus() + ")");
        }
        if (LocalDateTime.now().isAfter(deal.getDepositDeadline())) {
            throw new RuntimeException("Deposit deadline has passed for this deal");
        }
        if (deal.isDepositPaid()) {
            return; // already recorded — idempotent, safe to call twice
        }

        deal.setDepositPaid(true);
        deal.setRazorpayPaymentId(razorpayPaymentId);
        dealRepo.save(deal);

        tryUnlock(deal); // same private method from Stage 2 — unlocks if seller already confirmed too
    }

    @Override
    @Transactional
    public void markBalancePaid(Long dealId, String razorpayPaymentId) {
        Deal deal = dealRepo.findById(dealId)
                .orElseThrow(() -> new RuntimeException("Deal not found"));

        if (deal.getStatus() != DealStatus.CONTACT_UNLOCKED) {
            throw new RuntimeException("This deal is not ready for a balance payment (status: " + deal.getStatus() + ")");
        }
        if (deal.isBalancePaid()) {
            return; // already recorded — idempotent, safe to call twice
        }

        deal.setBalancePaid(true);
        deal.setRazorpayBalancePaymentId(razorpayPaymentId);
        deal.setBalancePaidAt(LocalDateTime.now());
        deal.setStatus(DealStatus.COMPLETED);
        dealRepo.save(deal);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DealResponseDTO> getMyDealsAsSeller(Long sellerId) {
        return dealRepo.findByCarSellerId(sellerId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private DealResponseDTO mapToDto(Deal deal) {
        DealResponseDTO dto = new DealResponseDTO();
        dto.setDealId(deal.getId());
        dto.setDealType(deal.getDealType().name());
        dto.setCarId(deal.getCar().getId());
        dto.setBrand(deal.getCar().getBrand());
        dto.setModel(deal.getCar().getModel());
        dto.setRegistrationNo(deal.getCar().getRegistrationNo());
        dto.setAgreedPrice(deal.getAgreedPrice());
        dto.setDepositAmount(deal.getDepositAmount());
        dto.setSellerConfirmation(deal.getSellerConfirmation().name());
        dto.setSellerConfirmDeadline(deal.getSellerConfirmDeadline());
        dto.setDepositPaid(deal.isDepositPaid());
        dto.setDepositDeadline(deal.getDepositDeadline());
        dto.setStatus(deal.getStatus().name());
        dto.setRemainingAmount(deal.getRemainingAmount());
        dto.setBalancePaid(deal.isBalancePaid());
        dto.setBalancePaidAt(deal.getBalancePaidAt());
        dto.setBuyerName(deal.getBuyer().getFirstName() + " " + deal.getBuyer().getLastName());

        User seller = deal.getCar().getSeller();
        dto.setSellerName(seller.getFirstName() + " " + seller.getLastName());

        // Contact stays visible from the moment it unlocks through completion —
        // not just on the single tick it flips.
        if (deal.getStatus() == DealStatus.CONTACT_UNLOCKED || deal.getStatus() == DealStatus.COMPLETED) {
            dto.setSellerContact(seller.getPhone());
            dto.setSellerEmail(seller.getEmail());
        }

        return dto;
    }
}