package com.travel.travelrecommendation1.controller;

import com.travel.travelrecommendation1.dto.RecommendationRequest;
import com.travel.travelrecommendation1.dto.RecommendationResponse;
import com.travel.travelrecommendation1.model.Destination;
import com.travel.travelrecommendation1.service.RecommendationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:3000")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @Autowired
    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping
    public ResponseEntity<RecommendationResponse> getRecommendations(@Valid @RequestBody RecommendationRequest request,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String errorMsg = bindingResult.getAllErrors().get(0).getDefaultMessage();
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, errorMsg);
        }
        RecommendationResponse response = recommendationService.getRecommendations(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/destinations")
    public ResponseEntity<List<Destination>> getAllDestinations() {
        List<Destination> destinations = recommendationService.getAllDestinations();
        return ResponseEntity.ok(destinations);
    }

    @GetMapping("/destinations/{id}")
    public ResponseEntity<Destination> getDestinationById(@PathVariable Long id) {
        Destination destination = recommendationService.getDestinationById(id);
        if (destination == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Destination not found");
        }
        return ResponseEntity.ok(destination);
    }
}
