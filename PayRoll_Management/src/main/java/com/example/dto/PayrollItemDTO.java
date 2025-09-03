package com.example.dto;

import java.math.BigDecimal;

public class PayrollItemDTO {

    private Long id;
    private Long employeeId;
    private String employeeName;
    private BigDecimal basicSalary;
    private BigDecimal deductions;
    private BigDecimal bonus;
    private BigDecimal netSalary;

    public PayrollItemDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public BigDecimal getBasicSalary() { return basicSalary; }
    public void setBasicSalary(BigDecimal basicSalary) { this.basicSalary = basicSalary; }

    public BigDecimal getDeductions() { return deductions; }
    public void setDeductions(BigDecimal deductions) { this.deductions = deductions; }

    public BigDecimal getBonus() { return bonus; }
    public void setBonus(BigDecimal bonus) { this.bonus = bonus; }

    public BigDecimal getNetSalary() { return netSalary; }
    public void setNetSalary(BigDecimal netSalary) { this.netSalary = netSalary; }
    
   

}
