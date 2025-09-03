package com.example.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.PayrollItemDTO;
import com.example.dto.PayrollRunRequest;
import com.example.entity.PayrollItem;
import com.example.entity.PayrollRun;
import com.example.entity.PayrollRunStatus;
import com.example.exception.ConflictException;
import com.example.exception.ResourceNotFoundException;
import com.example.repo.PayrollItemRepository;
import com.example.repo.PayrollRunRepository;
import com.example.service.PayrollService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/payroll")
@PreAuthorize("hasRole('ADMIN')")
public class PayrollController {

    private final PayrollService payrollService;
    private final PayrollRunRepository runRepo;
    private final PayrollItemRepository itemRepo;

    @Autowired
    public PayrollController(PayrollService payrollService,
                             PayrollRunRepository runRepo,
                             PayrollItemRepository itemRepo) {
        this.payrollService = payrollService;
        this.runRepo = runRepo;
        this.itemRepo = itemRepo;
    }

    @PostMapping("/runs")
    public ResponseEntity<PayrollRun> createRun(@Valid @RequestBody PayrollRunRequest req) {
        return ResponseEntity.ok(payrollService.createRun(req.getYear(), req.getMonth()));
    }

    @PostMapping("/runs/{id}/process")
    public ResponseEntity<PayrollRun> process(@PathVariable Long id) {
        return ResponseEntity.ok(payrollService.processRun(id));
    }

    @PostMapping("/runs/{id}/lock")
    public ResponseEntity<PayrollRun> lock(@PathVariable Long id) {
        return ResponseEntity.ok(payrollService.lockRun(id));
    }

    // ✅ Return DTOs to avoid lazy-loading issues
    @GetMapping("/runs/{id}/items")
    public ResponseEntity<List<PayrollItemDTO>> items(@PathVariable Long id) {
        return ResponseEntity.ok(payrollService.itemsDto(id));
    }

    // List all runs
    @GetMapping("/runs")
    public ResponseEntity<List<PayrollRun>> listRuns() {
        return ResponseEntity.ok(runRepo.findAll());
    }

    // Delete a DRAFT run (also deletes its items)
    @DeleteMapping("/runs/{id}")
    public ResponseEntity<Void> deleteRun(@PathVariable Long id) {
        PayrollRun run = runRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Run not found: " + id));

        if (run.getStatus() != PayrollRunStatus.DRAFT) {
            throw new ConflictException("Only DRAFT runs can be deleted.");
        }

        itemRepo.deleteByRun(run);
        runRepo.delete(run);
        return ResponseEntity.noContent().build();
    }
}
