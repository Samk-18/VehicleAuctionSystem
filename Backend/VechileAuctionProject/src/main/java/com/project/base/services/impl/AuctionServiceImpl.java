package com.project.base.services.impl;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.base.dto.AuctionResponseDTO;
import com.project.base.pojo.Auction;
import com.project.base.pojo.AuctionStatus;
import com.project.base.pojo.Bid;
import com.project.base.pojo.Car;
import com.project.base.pojo.CarImage;
import com.project.base.pojo.Status;
import com.project.base.pojo.User;
import com.project.base.repository.AuctionRepository;
import com.project.base.repository.BidRepository;
import com.project.base.repository.CarRepository;
import com.project.base.services.AuctionService;
import com.project.base.services.DealService;

@Service
public class AuctionServiceImpl implements AuctionService {

    @Autowired
    private AuctionRepository auctionRepo;

    @Autowired
    private CarRepository carRepo;

    @Autowired
    private BidRepository bidRepo;
    
    @Autowired
    private DealService dealService;
    
    @Override
    @Transactional(readOnly = true)
    public List<AuctionResponseDTO> getMyAuctionsAsSeller(Long sellerId) {
        return auctionRepo.findByCarSellerIdOrderByStartTimeDesc(sellerId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
 
    @Override
    @Transactional(readOnly = true)
    public List<AuctionResponseDTO> viewActiveAuctions() {

        return auctionRepo.findByStatus(AuctionStatus.ACTIVE)
                .stream()
                .map(this::mapToDto)
                .toList();
    }


    @Override
    @Transactional(readOnly = true)
    public AuctionResponseDTO getAuctionById(Long auctionId) {

        Auction auction = auctionRepo.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));

        return mapToDto(auction);
    }

    // ================= SELLER =================

    @Override
    @Transactional
    public void startAuction(Long carId, Long sellerId, LocalDateTime scheduledStartTime, int durationMinutes) {

        Car car = carRepo.findByIdForUpdate(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        if (!car.getSeller().getId().equals(sellerId)) {
            throw new RuntimeException("You are not the owner of this car");
        }
        if (car.getStatus() != Status.AVAILABLE) {
            throw new RuntimeException("Car must be approved before auction");
        }
        if (car.getAuctionAttempts() >= 3) {
            throw new RuntimeException("Maximum auction attempts reached");
        }
        if (car.getLastAuctionEndedAt() != null) {
            long hours = Duration.between(car.getLastAuctionEndedAt(), LocalDateTime.now()).toHours();
            if (hours < 1) throw new RuntimeException("Cooldown period not completed");
        }
        if (auctionRepo.existsByCarIdAndStatus(carId, AuctionStatus.ACTIVE)
                || auctionRepo.existsByCarIdAndStatus(carId, AuctionStatus.SCHEDULED)) {
            throw new RuntimeException("An auction is already active or scheduled for this car");
        }
        if (durationMinutes < 5 || durationMinutes > 360) {
            throw new RuntimeException("Duration must be between 5 minutes and 6 hours");
        }

        LocalDateTime start = (scheduledStartTime == null || scheduledStartTime.isBefore(LocalDateTime.now()))
                ? LocalDateTime.now()
                : scheduledStartTime;

        boolean startsNow = !start.isAfter(LocalDateTime.now());

        Auction auction = new Auction();
        auction.setCar(car);
        auction.setStartTime(start);
        auction.setEndTime(start.plusMinutes(durationMinutes));
        auction.setStatus(startsNow ? AuctionStatus.ACTIVE : AuctionStatus.SCHEDULED);
        auction.setStartPrice(BigDecimal.valueOf(car.getPrice()));
        auction.setCurrentPrice(BigDecimal.valueOf(car.getPrice()));

        auctionRepo.save(auction);

        car.setStatus(startsNow ? Status.UNDER_AUCTION : Status.AVAILABLE);
        car.setAuctionAttempts(car.getAuctionAttempts() + 1);
        carRepo.save(car);
    }

    // New scheduled job — promotes SCHEDULED auctions to ACTIVE when their time arrives
    @Scheduled(fixedRate = 60000)
    @Transactional							
    public void activateScheduledAuctions() {
        List<Auction> due = auctionRepo.findByStatusAndStartTimeBefore(AuctionStatus.SCHEDULED, LocalDateTime.now());
        for (Auction auction : due) {
            auction.setStatus(AuctionStatus.ACTIVE);
            auctionRepo.save(auction);

            Car car = auction.getCar();
            car.setStatus(Status.UNDER_AUCTION);
            carRepo.save(car);

            System.out.println("🟢 Scheduled auction activated: " + auction.getId());
        }
    }

    // ================= SYSTEM =================

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void closeExpiredAuctions() {

        System.out.println("⏰ Scheduler running at " + LocalDateTime.now());

        List<Auction> expiredAuctions =
                auctionRepo.findByStatusAndEndTimeBefore(
                        AuctionStatus.ACTIVE,
                        LocalDateTime.now()
                );

        System.out.println("Expired auctions found: " + expiredAuctions.size());

        for (Auction auction : expiredAuctions) {
            auction.setStatus(AuctionStatus.COMPLETED);
            auctionRepo.save(auction);

            Car car = auction.getCar();
            Bid topBid = bidRepo.findTopByAuctionOrderByBidAmountDesc(auction);

            car.setStatus(topBid != null ? Status.AUCTION_COMPLETED : Status.AVAILABLE);
            car.setLastAuctionEndedAt(LocalDateTime.now());
            carRepo.save(car);

            if (topBid != null) {
                dealService.createDealForAuctionWin(auction, topBid);
            }

            System.out.println("✅ Auction COMPLETED: " + auction.getId());
        }
    }

    // ================= USER DASHBOARD =================

    @Override
    @Transactional(readOnly = true)
    public List<AuctionResponseDTO> getMyWonAuctions(User user) {

        return bidRepo.findWonAuctionsByUser(user)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // ================= ENTITY → DTO =================

    private AuctionResponseDTO mapToDto(Auction auction) {

        AuctionResponseDTO dto = new AuctionResponseDTO();
        dto.setAuctionId(auction.getId());
        dto.setCarId(auction.getCar().getId());
        dto.setBrand(auction.getCar().getBrand());
        dto.setModel(auction.getCar().getModel());
        Car car = auction.getCar();
        dto.setManufacturer(car.getManufacturer());
        dto.setManufactureYear(car.getManufactureYear());
        dto.setFuelType(car.getFuelType() != null ? car.getFuelType().name() : null);
        dto.setTransmission(car.getTransmission() != null ? car.getTransmission().name() : null);
        dto.setKmDriven(car.getKmDriven() != null ? car.getKmDriven() : 0);
        dto.setMileage(car.getMileage() != null ? car.getMileage() : 0);
        dto.setColor(car.getColor());
        dto.setEngineCc(car.getEngineCc() != null ? car.getEngineCc() : 0);
        dto.setDescription(car.getDescription());
        dto.setRegistrationNo(car.getRegistrationNo());
        dto.setSaleType(car.getSaleType() != null ? car.getSaleType().name() : null);
        if (car.getSeller() != null) {
            dto.setSellerName(car.getSeller().getFirstName() + " " + car.getSeller().getLastName());
        }
        dto.setAuctionAttempts(auction.getCar().getAuctionAttempts());
        dto.setImageUrls(
            auction.getCar().getImages().stream().map(CarImage::getImageUrl).collect(Collectors.toList())
        );
        dto.setCurrentPrice(
            auction.getCurrentPrice() != null ? auction.getCurrentPrice() : BigDecimal.valueOf(auction.getCar().getPrice())
        );
        dto.setEndTime(auction.getEndTime());
        dto.setStatus(auction.getStatus().name());
        dto.setPaid(auction.isPaid());
              
        List<Bid> bids = bidRepo.findBidsByAuctionOrderedDesc(auction.getId());
        dto.setBidCount(bids.size());

        if (!bids.isEmpty()) {
            Bid topBid = bids.get(0);
            dto.setTopBidderName(topBid.getBidder().getFirstName());
            dto.setTopBidAmount(topBid.getBidAmount());

            if (auction.getStatus() == AuctionStatus.COMPLETED) {
                dto.setWinnerId(topBid.getBidder().getId());
                dto.setWinnerName(topBid.getBidder().getFirstName());
                dto.setFinalPrice(topBid.getBidAmount());
            }
        }

        return dto;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AuctionResponseDTO> getAllAuctionsForAdmin() {

        return auctionRepo.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public void markAsPaid(Long auctionId) {
        Auction auction = auctionRepo.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));

        if (auction.getStatus() != AuctionStatus.COMPLETED) {
            throw new RuntimeException("Auction not completed yet");
        }
        if (auction.isPaid()) {
            throw new RuntimeException("Auction already paid");
        }

        auction.setPaid(true);
        auction.setPaymentTime(LocalDateTime.now());
        auctionRepo.save(auction);

        Car car = auction.getCar();
        car.setStatus(Status.SOLD);
        carRepo.save(car);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuctionResponseDTO> getLiveAuctionsForAdmin() {
        return auctionRepo.findByStatus(AuctionStatus.ACTIVE)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelAuction(Long auctionId) {

        Auction auction = auctionRepo.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));

        if (auction.getStatus() != AuctionStatus.ACTIVE) {
            throw new RuntimeException("Only active auctions can be cancelled");
        }

        auction.setStatus(AuctionStatus.CANCELLED);
        auctionRepo.save(auction);

        Car car = auction.getCar();
        car.setStatus(Status.AVAILABLE);
        car.setLastAuctionEndedAt(LocalDateTime.now());
        carRepo.save(car);
    }

    @Override
    @Transactional
    public void extendAuction(Long auctionId, int extraMinutes) {

        if (extraMinutes <= 0 || extraMinutes > 120) {
            throw new RuntimeException("Extension must be between 1 and 120 minutes");
        }

        Auction auction = auctionRepo.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));

        if (auction.getStatus() != AuctionStatus.ACTIVE) {
            throw new RuntimeException("Only active auctions can be extended");
        }

        auction.setEndTime(auction.getEndTime().plusMinutes(extraMinutes));
        auctionRepo.save(auction);
    }

}
