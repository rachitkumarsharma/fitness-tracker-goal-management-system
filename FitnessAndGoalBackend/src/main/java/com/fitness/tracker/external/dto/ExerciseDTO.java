package com.fitness.tracker.external.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing an exercise from the API Ninjas Exercise API.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ExerciseDTO {

    @JsonProperty("name")
    private String name;

    @JsonProperty("type")
    private String type;

    @JsonProperty("muscle")
    private String muscle;

    @JsonProperty("equipment")
    private String equipment;

    @JsonProperty("difficulty")
    private String difficulty;

    @JsonProperty("instructions")
    private String instructions;
}

