using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PaymentServiceNet.DTOs
{
    public class PaymentVerifyRequest
    {
        [Required]
        [JsonPropertyName("razorpay_order_id")]
        public string RazorpayOrderId { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("razorpay_payment_id")]
        public string RazorpayPaymentId { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("razorpay_signature")]
        public string RazorpaySignature { get; set; } = string.Empty;
    }
}
