package com.travel.travelrecommendation1.service;

import com.travel.travelrecommendation1.dto.RecommendationRequest;
import com.travel.travelrecommendation1.dto.RecommendationResponse;
import com.travel.travelrecommendation1.model.Destination;

import java.util.List;

public interface RecommendationService {
    RecommendationResponse getRecommendations(RecommendationRequest request);
    List<Destination> getAllDestinations();
    Destination getDestinationById(Long id);
}
