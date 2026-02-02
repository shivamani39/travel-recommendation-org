package com.travel.travelrecommendation1.dto;
// ...existing code...
import com.travel.travelrecommendation1.model.Destination;
import java.util.List;

public class RecommendationWithReason {
    private Destination destination;
    private String reason;

    public RecommendationWithReason(Destination destination, String reason) {
        this.destination = destination;
        this.reason = reason;
    }

    public Destination getDestination() { return destination; }
    public void setDestination(Destination destination) { this.destination = destination; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
