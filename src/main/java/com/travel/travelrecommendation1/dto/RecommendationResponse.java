package com.travel.travelrecommendation1.dto;

import java.util.List;

public class RecommendationResponse {
    private List<RecommendationWithReason> recommendations;

    public RecommendationResponse() {}

    public RecommendationResponse(List<RecommendationWithReason> recommendations) {
        this.recommendations = recommendations;
    }

    public List<RecommendationWithReason> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<RecommendationWithReason> recommendations) {
        this.recommendations = recommendations;
    }
}
