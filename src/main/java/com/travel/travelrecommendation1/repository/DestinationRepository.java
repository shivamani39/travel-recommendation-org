package com.travel.travelrecommendation1.repository;

import com.travel.travelrecommendation1.model.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long> {
    // Custom query methods can be added here if needed
}
