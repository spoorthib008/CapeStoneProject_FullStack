package com.example.entity;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.persistence.Table;

@Entity
@Table(
    name = "payroll_items",
    uniqueConstraints = @UniqueConstraint(columnNames = {"run_id", "employee_id"})
)
public class PayrollItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "run_id", nullable = false)
    @JsonIgnore
    private PayrollRun run;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal basicSalary = BigDecimal.ZERO;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal deductions = BigDecimal.ZERO;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal bonus = BigDecimal.ZERO;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal netSalary = BigDecimal.ZERO;

    // ---- No-arg constructor (required by JPA)
    public PayrollItem() { }

    // ---- Optional convenience constructor
    public PayrollItem(PayrollRun run, Employee employee,
                       BigDecimal basicSalary, BigDecimal deductions,
                       BigDecimal bonus, BigDecimal netSalary) {
        this.run = run;
        this.employee = employee;
        this.basicSalary = basicSalary;
        this.deductions = deductions;
        this.bonus = bonus;
        this.netSalary = netSalary;
    }

    // ----------------- GETTERS -----------------
    public Long getId() { return id; }
    public PayrollRun getRun() { return run; }
    public Employee getEmployee() { return employee; }
    public BigDecimal getBasicSalary() { return basicSalary; }
    public BigDecimal getDeductions() { return deductions; }
    public BigDecimal getBonus() { return bonus; }
    public BigDecimal getNetSalary() { return netSalary; }

    // ----------------- SETTERS -----------------
    public void setId(Long id) { this.id = id; }
    public void setRun(PayrollRun run) { this.run = run; }
    public void setEmployee(Employee employee) { this.employee = employee; }
    public void setBasicSalary(BigDecimal basicSalary) { this.basicSalary = basicSalary; }
    public void setDeductions(BigDecimal deductions) { this.deductions = deductions; }
    public void setBonus(BigDecimal bonus) { this.bonus = bonus; }
    public void setNetSalary(BigDecimal netSalary) { this.netSalary = netSalary; }
}
