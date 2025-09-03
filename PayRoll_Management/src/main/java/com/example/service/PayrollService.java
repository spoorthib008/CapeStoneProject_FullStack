package com.example.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.dto.PayrollItemDTO;
import com.example.entity.Employee;
import com.example.entity.PayrollItem;
import com.example.entity.PayrollRun;
import com.example.entity.PayrollRunStatus;
import com.example.repo.EmployeeRepository;
import com.example.repo.PayrollItemRepository;
import com.example.repo.PayrollRunRepository;

@Service
public class PayrollService {

    private final PayrollRunRepository runRepo;
    private final EmployeeRepository empRepo;
    private final PayrollItemRepository itemRepo;

    @Autowired
    public PayrollService(PayrollRunRepository runRepo,
                          EmployeeRepository empRepo,
                          PayrollItemRepository itemRepo) {
        this.runRepo = runRepo;
        this.empRepo = empRepo;
        this.itemRepo = itemRepo;
    }

    /** Create a payroll run for a year/month (unique). */
    public PayrollRun createRun(int year, int month) {
        runRepo.findByYearAndMonth(year, month).ifPresent(r -> {
            throw new RuntimeException("Payroll run already exists for " + year + "-" + month);
        });
        PayrollRun run = new PayrollRun(year, month);
        run.setStatus(PayrollRunStatus.DRAFT);
        return runRepo.save(run);
    }

    /** Calculate items for all employees; simple rule: deductions = 5% of base, bonus = 0. */
    @Transactional
    public PayrollRun processRun(Long runId) {
        PayrollRun run = runRepo.findById(runId)
                .orElseThrow(() -> new RuntimeException("Run not found: " + runId));

        if (run.getStatus() == PayrollRunStatus.LOCKED) {
            throw new RuntimeException("Run is locked and cannot be processed.");
        }

        List<Employee> employees = empRepo.findAll();

        for (Employee e : employees) {
            BigDecimal basic = e.getBaseSalary() != null ? e.getBaseSalary() : BigDecimal.ZERO;
            BigDecimal bonus = BigDecimal.ZERO;
            BigDecimal deductions = basic.multiply(new BigDecimal("0.05")); // 5%
            BigDecimal net = basic.add(bonus).subtract(deductions);

            // one item per employee per run
            itemRepo.findByRunAndEmployee(run, e).ifPresentOrElse(
                    existing -> { /* idempotent: do nothing if exists */ },
                    () -> {
                        PayrollItem item = new PayrollItem();
                        item.setRun(run);
                        item.setEmployee(e);
                        item.setBasicSalary(basic);
                        item.setBonus(bonus);
                        item.setDeductions(deductions);
                        item.setNetSalary(net);
                        itemRepo.save(item);
                    }
            );
        }

        run.setStatus(PayrollRunStatus.PROCESSED);
        return runRepo.save(run);
    }

    /** Lock the run to prevent changes. */
    public PayrollRun lockRun(Long runId) {
        PayrollRun run = runRepo.findById(runId)
                .orElseThrow(() -> new RuntimeException("Run not found: " + runId));
        run.setStatus(PayrollRunStatus.LOCKED);
        return runRepo.save(run);
    }

    /** (Entities) List all payroll items of a run. Avoid using this in controllers directly. */
    @Transactional(readOnly = true)
    public List<PayrollItem> items(Long runId) {
        PayrollRun run = runRepo.findById(runId)
                .orElseThrow(() -> new RuntimeException("Run not found: " + runId));
        return itemRepo.findByRun(run);
    }

    /** ✅ DTO list for a run (safe for controllers/JSON). */
    @Transactional(readOnly = true)
    public List<PayrollItemDTO> itemsDto(Long runId) {
        List<PayrollItem> items = itemRepo.findAllByRunIdWithEmployee(runId);
        return items.stream().map(pi -> {
            PayrollItemDTO d = new PayrollItemDTO();
            d.setId(pi.getId());
            if (pi.getEmployee() != null) {
                d.setEmployeeId(pi.getEmployee().getId());
                String name = (pi.getEmployee().getFirstName() != null ? pi.getEmployee().getFirstName() : "")
                        + " "
                        + (pi.getEmployee().getLastName() != null ? pi.getEmployee().getLastName() : "");
                d.setEmployeeName(name.trim());
            }
            d.setBasicSalary(pi.getBasicSalary());
            d.setDeductions(pi.getDeductions());
            d.setBonus(pi.getBonus());
            d.setNetSalary(pi.getNetSalary());
            return d;
        }).toList();
    }

    /** ✅ DTO for the current employee's payslip (safe for controllers/JSON). */
    @Transactional(readOnly = true)
    public PayrollItemDTO mySlipDto(int year, int month, Employee me) {
        PayrollRun run = runRepo.findByYearAndMonth(year, month)
                .orElseThrow(() -> new RuntimeException("Run not found for " + year + "-" + month));

        PayrollItem pi = itemRepo.findByRunAndEmployee(run, me)
                .orElseThrow(() -> new RuntimeException("No payroll item for this employee in the run."));

        PayrollItemDTO dto = new PayrollItemDTO();
        dto.setId(pi.getId());
        dto.setEmployeeId(me.getId());
        String name = (me.getFirstName() != null ? me.getFirstName() : "")
                + " "
                + (me.getLastName() != null ? me.getLastName() : "");
        dto.setEmployeeName(name.trim());
        dto.setBasicSalary(pi.getBasicSalary());
        dto.setDeductions(pi.getDeductions());
        dto.setBonus(pi.getBonus());
        dto.setNetSalary(pi.getNetSalary());
        return dto;
    }
}
