package com.example.dto;

import java.math.BigDecimal;

public class PayrollSummaryResponse {
	 private int year;
	    private int month;
	    private int employeeCount;
	    private BigDecimal totalBasic;
	    private BigDecimal totalDeductions;
	    private BigDecimal totalBonus;
	    private BigDecimal totalNet;

	    public PayrollSummaryResponse() {}

	    public int getYear() { return year; }
	    public void setYear(int year) { this.year = year; }
	    public int getMonth() { return month; }
	    public void setMonth(int month) { this.month = month; }
	    public int getEmployeeCount() { return employeeCount; }
	    public void setEmployeeCount(int employeeCount) { this.employeeCount = employeeCount; }
	    public BigDecimal getTotalBasic() { return totalBasic; }
	    public void setTotalBasic(BigDecimal totalBasic) { this.totalBasic = totalBasic; }
	    public BigDecimal getTotalDeductions() { return totalDeductions; }
	    public void setTotalDeductions(BigDecimal totalDeductions) { this.totalDeductions = totalDeductions; }
	    public BigDecimal getTotalBonus() { return totalBonus; }
	    public void setTotalBonus(BigDecimal totalBonus) { this.totalBonus = totalBonus; }
	    public BigDecimal getTotalNet() { return totalNet; }
	    public void setTotalNet(BigDecimal totalNet) { this.totalNet = totalNet; }

}
