package com.uo.taxes.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "active_study")
public class ActiveStudyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ACTIVE_STUDY_ID", unique = true)
    private Long id;

    @Column(name = "FACULTY")
    private String faculty;

    @Column(name = "CYCLE")
    private String cycle;

    @Column(name = "DEPARTMENT")
    private String department;

    @Column(name = "STUDY_PROGRAM")
    private String studyProgram;

    @Column(name = "FORM")
    private String form;

    @Column(name = "YEAR")
    private Integer year;

    @Column(name = "ABBREVIATION")
    private String abbreviation;

    @Column(name = "BUDGET")
    private boolean budget;

    @Column(name = "ACCOMMODATED")
    private String accommodated;

    @ManyToOne
    @JoinColumn(name = "ACCOUNT_ID")
    @JsonIgnore
    private AccountEntity account;
}
