package com.example.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

@Getter @Setter
public class PayrollRunRequest {
	 @Min(2000) @Max(3000)
	    private int year;
	    @Min(1) @Max(12)
	    private int month;
	    
	    public PayrollRunRequest() { }

	    public PayrollRunRequest(int year, int month) {
	        this.year = year;
	        this.month = month;
	    }

	    // --- GETTERS ---
	    public int getYear() { return year; }
	    public int getMonth() { return month; }

	    // --- SETTERS (keep for @RequestBody binding) ---
	    public void setYear(int year) { this.year = year; }
	    public void setMonth(int month) { this.month = month; }

}
