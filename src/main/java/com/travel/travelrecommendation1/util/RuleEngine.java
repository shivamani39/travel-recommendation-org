package com.travel.travelrecommendation1.util;

import com.travel.travelrecommendation1.model.Destination;
import java.util.List;

public class RuleEngine {
    // Placeholder for more complex rule logic if needed in the future
    public static boolean matches(Destination destination, Integer budget, Integer duration, List<String> interests) {
        boolean budgetMatch = (budget >= destination.getMinBudget() && budget <= destination.getMaxBudget());
        boolean durationMatch = (duration >= destination.getMinDuration() && duration <= destination.getMaxDuration());
        List<String> destInterests = List.of(destination.getInterests().split(","));
        boolean interestMatch = interests.stream().anyMatch(destInterests::contains);
        return budgetMatch && durationMatch && interestMatch;
    }
}
