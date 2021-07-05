package com.uo.taxes.domain;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "study")
public class StudyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "STUDY_ID", unique = true)
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

    @OneToMany(fetch = FetchType.LAZY,
            cascade = CascadeType.ALL)
    @JoinColumn(name = "STUDY_ID")
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property="id")
    private Set<StudyFeeEntity> studyFees;

    @Column(name = "YEAR")
    private Integer year;

    @Column(name = "ABBREVIATION")
    private String abbreviation;
}
