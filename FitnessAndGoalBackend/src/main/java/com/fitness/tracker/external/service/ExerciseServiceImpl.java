package com.fitness.tracker.external.service;

import com.fitness.tracker.external.client.ExerciseClient;
import com.fitness.tracker.external.dto.ExerciseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implementation of ExerciseService with caching support.
 * Results are cached to reduce external API calls and improve performance.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ExerciseServiceImpl implements ExerciseService {

    private final ExerciseClient exerciseClient;

    @Override
    @Cacheable(value = "exercises", key = "'muscle:' + #muscle")
    public List<ExerciseDTO> searchByMuscle(String muscle) {
        log.debug("Cache miss for muscle: {}", muscle);
        return exerciseClient.searchByMuscle(muscle);
    }

    @Override
    @Cacheable(value = "exercises", key = "'name:' + #name")
    public List<ExerciseDTO> searchByName(String name) {
        log.debug("Cache miss for name: {}", name);
        return exerciseClient.searchByName(name);
    }

    @Override
    @Cacheable(value = "exercises", key = "'difficulty:' + #difficulty")
    public List<ExerciseDTO> searchByDifficulty(String difficulty) {
        log.debug("Cache miss for difficulty: {}", difficulty);
        return exerciseClient.searchByDifficulty(difficulty);
    }

    @Override
    @Cacheable(value = "exercises", key = "'type:' + #type")
    public List<ExerciseDTO> searchByType(String type) {
        log.debug("Cache miss for type: {}", type);
        return exerciseClient.searchByType(type);
    }

    /**
     * Scheduled cache eviction every 6 hours to keep exercise data fresh.
     */
    @Scheduled(fixedRate = 21600000) // 6 hours in milliseconds
    @CacheEvict(value = "exercises", allEntries = true)
    public void clearExerciseCache() {
        log.info("Clearing exercise cache");
    }
}

