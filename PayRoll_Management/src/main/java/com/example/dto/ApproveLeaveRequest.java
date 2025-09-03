package com.example.dto;

import com.example.entity.LeaveStatus;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter
public class ApproveLeaveRequest {
	
	@NotNull
	private LeaveStatus status;

	public ApproveLeaveRequest() {}

    public ApproveLeaveRequest(LeaveStatus status) {
        this.status = status;
    }

    // --- GETTER ---
    public LeaveStatus getStatus() {
        return status;
    }

    // --- SETTER (needed for @RequestBody binding) ---
    public void setStatus(LeaveStatus status) {
        this.status = status;
    }
}
