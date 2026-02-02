package com.travel.travelrecommendation1.service;

import com.travel.travelrecommendation1.dto.RecommendationRequest;
import com.travel.travelrecommendation1.dto.RecommendationResponse;
import com.travel.travelrecommendation1.dto.RecommendationWithReason;
import com.travel.travelrecommendation1.model.Destination;
import com.travel.travelrecommendation1.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class RecommendationServiceImpl implements RecommendationService {

    private final DestinationRepository destinationRepository;

    @Autowired
    public RecommendationServiceImpl(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }

    @Override
    public RecommendationResponse getRecommendations(RecommendationRequest request) {
        List<Destination> allDestinations = destinationRepository.findAll();
        List<String> userInterests = request.getInterests();
        Integer budget = request.getBudget();
        Integer duration = request.getDuration();
        String country = request.getCountry();
        Integer minBudget = request.getMinBudget();
        Integer maxBudget = request.getMaxBudget();
        Integer minDuration = request.getMinDuration();
        Integer maxDuration = request.getMaxDuration();
        Integer limit = request.getLimit() != null ? request.getLimit() : 10;

        // Count interest priorities (repeats = higher priority)
        java.util.Map<String, Integer> interestPriority = new java.util.HashMap<>();
        for (String interest : userInterests) {
            interestPriority.put(interest, interestPriority.getOrDefault(interest, 0) + 1);
        }

        class ScoredDestination {
            Destination destination;
            int score;
            String reason;
            String country;

            ScoredDestination(Destination d, int s, String r) {
                destination = d;
                score = s;
                reason = r;
                country = d.getCountry();
            }
        }
        List<ScoredDestination> scoredList = new ArrayList<>();
        for (Destination dest : allDestinations) {
            int score = 0;
            StringBuilder reason = new StringBuilder();
            // Budget match: User's max budget must be enough for at least the min cost of
            // the trip
            if (budget >= dest.getMinBudget()) {
                score += 3;
                reason.append("Fits your budget. ");
            } else {
                // Penalty only if budget is too low
                int penalty = (int) Math.round((dest.getMinBudget() - budget) * 1.0 / 100);
                score -= penalty;
                if (penalty > 0)
                    reason.append("Over budget. ");
            }
            // Duration match: User's max duration must be enough for at least the min
            // duration of the trip
            if (duration >= dest.getMinDuration()) {
                score += 2;
                reason.append("Fits your duration. ");
            } else {
                // Penalty only if duration is too short
                int penalty = (dest.getMinDuration() - duration);
                score -= penalty;
                if (penalty > 0)
                    reason.append("Not enough time. ");
            }
            // Country match
            if (country != null && !country.isEmpty() && dest.getCountry().equalsIgnoreCase(country)) {
                score += 2;
                reason.append("In your preferred country. ");
            }
            // Dynamic Pricing & Duration Logic
            // Calculate daily rate (MinBudget / MinDuration)
            double dailyRate = (double) dest.getMinBudget() / (dest.getMinDuration() > 0 ? dest.getMinDuration() : 1);

            // Determine valid duration overlap between User Request and Destination
            // Availability
            int userMinDur = (minDuration != null) ? minDuration : 0;
            int userMaxDur = (maxDuration != null) ? maxDuration : Integer.MAX_VALUE;

            // Intersection of [userMin, userMax] and [destMin, destMax]
            int validStart = Math.max(userMinDur, dest.getMinDuration());
            int validEnd = Math.min(userMaxDur, dest.getMaxDuration());

            if (validStart > validEnd) {
                continue; // No duration overlap
            }

            // Calculate Projected Cost for the valid duration
            int projectedCost = (int) (dailyRate * validStart);

            // Strict Budget Filtering on the Projected Cost
            int userMinBud = (minBudget != null) ? minBudget : 0;
            int userMaxBud = (maxBudget != null) ? maxBudget : Integer.MAX_VALUE;

            if (projectedCost > userMaxBud) {
                continue; // Too expensive
            }

            int maxProjectedCost = (int) (dailyRate * validEnd);
            // If even max duration cost is less than min budget, it's too cheap?
            // Maybe not strict here. Let's allow cheap trips.
            // But if projectedCost (min valid cost) is significantly below userMinBud?
            // User: 500-1000. Project: 200.
            // Let's assume user accepts cheaper options. But usually filters are ranges.
            // If I say "Budget 500-1000", I assume min 500.
            if (maxProjectedCost < userMinBud) {
                continue; // Too cheap (below user's minimum spend preference)
            }

            // Valid!
            int displayPrice = projectedCost;
            // Best Match Price Adjustment
            // If projectedCost < userMinBud, it means min duration is too cheap.
            // We can check if a longer duration fits the budget?
            // e.g. 5 days = 200. Rate=40. User Min=500.
            // Need 500/40 = 12.5 days.
            // Can we stay 13 days?
            // If validEnd >= 13, then we can suggest a trip of 13 days costing 520.
            // Then effective price = 520.
            // Let's check this "Upsell" logic?
            if (displayPrice < userMinBud) {
                int daysNeeded = (int) Math.ceil((double) userMinBud / dailyRate);
                if (daysNeeded <= validEnd) {
                    displayPrice = (int) (dailyRate * daysNeeded);
                    // Update validStart to reflect the days needed for this price
                    validStart = daysNeeded;
                } else {
                    // Even max duration is too cheap. But wait, maxProjectedCost >= userMinBud
                    // check passed earlier?
                    // No, I added the check above. So maxProjectedCost >= userMinBud.
                    // So daysNeeded MUST be <= validEnd.
                    // So this block IS reachable and correct.
                    displayPrice = (int) (dailyRate * daysNeeded);
                    validStart = daysNeeded;
                }
            }

            // Create a COPY of the destination to modify displayed values
            Destination modifiedDest = new Destination();
            modifiedDest.setId(dest.getId());
            modifiedDest.setName(dest.getName());
            modifiedDest.setCountry(dest.getCountry());
            modifiedDest.setDescription(dest.getDescription());
            modifiedDest.setImage(dest.getImage());
            modifiedDest.setRating(dest.getRating());
            modifiedDest.setReviews(dest.getReviews());
            modifiedDest.setInterests(dest.getInterests());
            modifiedDest.setHighlights(dest.getHighlights());
            modifiedDest.setBestTime(dest.getBestTime());

            // Set dynamic values
            modifiedDest.setMinBudget(displayPrice);
            modifiedDest.setMaxBudget(displayPrice); // Single value: Min == Max implies single price
            modifiedDest.setMinDuration(validStart);
            modifiedDest.setMaxDuration(validStart); // Single value matching the price

            // Use modifiedDest for the rest of processing
            dest = modifiedDest;
            // Interest overlap with priority
            List<String> destInterests = Arrays.asList(dest.getInterests().split(","));
            int interestMatches = 0;
            int interestScore = 0;
            for (String interest : userInterests) {
                if (destInterests.contains(interest)) {
                    int priority = interestPriority.getOrDefault(interest, 1);
                    interestScore += 2 * priority;
                    interestMatches += priority;
                }
            }
            score += interestScore;
            if (interestMatches > 0) {
                reason.append("Matches ").append(interestMatches).append(" of your interests. ");
            }
            // Only add if at least one interest matches and score > 0
            Set<String> intersection = new HashSet<>(userInterests);
            intersection.retainAll(destInterests);
            if (!intersection.isEmpty() && score > 0) {
                scoredList.add(new ScoredDestination(dest, score, reason.toString().trim()));
            }
        }
        // Sort by score descending
        scoredList.sort((a, b) -> Integer.compare(b.score, a.score));
        // Diversity bonus: encourage other countries in top results
        java.util.Map<String, Integer> countryCount = new java.util.HashMap<>();
        for (int i = 0; i < Math.min(limit, scoredList.size()); i++) {
            String c = scoredList.get(i).country;
            countryCount.put(c, countryCount.getOrDefault(c, 0) + 1);
        }
        for (ScoredDestination sd : scoredList) {
            if (countryCount.getOrDefault(sd.country, 0) > limit / 2) {
                // If overrepresented, small bonus to others
                for (ScoredDestination other : scoredList) {
                    if (!other.country.equals(sd.country)) {
                        other.score += 1;
                        other.reason += " Diversity bonus.";
                    }
                }
                break;
            }
        }
        // Resort after diversity bonus
        scoredList.sort((a, b) -> Integer.compare(b.score, a.score));
        // Limit results and build RecommendationWithReason
        List<RecommendationWithReason> topResults = new ArrayList<>();
        for (int i = 0; i < Math.min(limit, scoredList.size()); i++) {
            ScoredDestination sd = scoredList.get(i);
            topResults.add(new RecommendationWithReason(sd.destination, sd.reason.trim()));
        }
        return new RecommendationResponse(topResults);
    }

    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }

    public Destination getDestinationById(Long id) {
        Optional<Destination> dest = destinationRepository.findById(id);
        return dest.orElse(null);
    }
}
