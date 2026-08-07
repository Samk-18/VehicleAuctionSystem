using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PaymentServiceNet.Models
{
    [Table("payments")]
    public class Payment
    {
        public long Id { get; set; }
        public long UserId { get; set; }  // Reference to user in Spring app
        public double Amount { get; set; }
        public PaymentStatus Status { get; set; }
        public PaymentFor PaymentFor { get; set; }
        public long ReferenceId { get; set; }
        public string? RazorpayOrderId { get; set; }
        public string? RazorpayPaymentId { get; set; }
        public string? RazorpaySignature { get; set; }
        public DateTime PaymentTime { get; set; }
    }

}
