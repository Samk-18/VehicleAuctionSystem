using PaymentServiceNet.Data;
using PaymentServiceNet.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace PaymentServiceNet.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly PaymentDbContext _context;
        private readonly UserClient _userClient; // 👈 inject

        public PaymentService(PaymentDbContext context, UserClient userClient)
        {
            _context = context;
            _userClient = userClient;
        }

        public async Task<Payment> CreateOrderAsync(double amount, long userId, PaymentFor paymentFor, long? referenceId)
        {
            var user = await _userClient.GetUserById(userId);
            var payment = new Payment
            {
                UserId = userId,
                Amount = amount,
                Status = PaymentStatus.CREATED,
                PaymentFor = paymentFor,
                ReferenceId = referenceId ?? 0,
                PaymentTime = DateTime.Now,
                RazorpayOrderId = "order_" + Guid.NewGuid().ToString("N") // placeholder
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return payment;
        }

        public async Task VerifyPaymentAsync(string orderId, string paymentId, string signature)
        {
            var payment = await _context.Payments.FirstOrDefaultAsync(p => p.RazorpayOrderId == orderId);
            if (payment == null) throw new Exception("Payment not found");

            if (payment.Status == PaymentStatus.SUCCESS) return;

            // For now, skip signature verification
            payment.RazorpayPaymentId = paymentId;
            payment.RazorpaySignature = signature;
            payment.Status = PaymentStatus.SUCCESS;

            await _context.SaveChangesAsync();
        }
    }
}
