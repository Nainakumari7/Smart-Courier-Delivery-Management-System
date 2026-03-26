package com.smartcourier.deliveryservice.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AgentAssignmentRequest {
    @NotNull
    private Long agentId;
}
