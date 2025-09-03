package com.example.dto;

import java.math.BigDecimal;

public class DepartmentCostRow {
	 private String department;
	    private BigDecimal totalBasic;
	    private BigDecimal totalDeductions;
	    private BigDecimal totalBonus;
	    private BigDecimal totalNet;

	    public DepartmentCostRow() {}

	    public String getDepartment() { return department; }
	    public void setDepartment(String department) { this.department = department; }
	    public BigDecimal getTotalBasic() { return totalBasic; }
	    public void setTotalBasic(BigDecimal totalBasic) { this.totalBasic = totalBasic; }
	    public BigDecimal getTotalDeductions() { return totalDeductions; }
	    public void setTotalDeductions(BigDecimal totalDeductions) { this.totalDeductions = totalDeductions; }
	    public BigDecimal getTotalBonus() { return totalBonus; }
	    public void setTotalBonus(BigDecimal totalBonus) { this.totalBonus = totalBonus; }
	    public BigDecimal getTotalNet() { return totalNet; }
	    public void setTotalNet(BigDecimal totalNet) { this.totalNet = totalNet; }

}
