package com.project.base.utils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import org.apache.commons.codec.binary.Hex;

public class RazorpaySignatureUtil {

    private static final String HMAC_SHA256 = "HmacSHA256";

    public static boolean verify(
            String orderId,
            String paymentId,
            String razorpaySignature,
            String secret
    ) {
        try {
            String payload = orderId + "|" + paymentId;

            Mac mac = Mac.getInstance(HMAC_SHA256);
            SecretKeySpec secretKey =
                    new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), HMAC_SHA256);
            mac.init(secretKey);

            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));

            String generatedSignature = Hex.encodeHexString(hash);

            return generatedSignature.equals(razorpaySignature);
        } catch (Exception e) {
            return false;
        }
    }
}
