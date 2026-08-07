using PaymentServiceNet.Models;

namespace PaymentServiceNet.Services
{
    public interface IPaymentService
    {
        Task<Payment> CreateOrderAsync(double amount, long userId, PaymentFor paymentFor, long referenceId);
        Task VerifyPaymentAsync(string orderId, string paymentId, string signature);
    }

}
