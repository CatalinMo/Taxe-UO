package com.uo.taxes.domain;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "study_fee")
public class StudyFeeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "STUDY_FEE_ID", unique = true)
    private Long id;

    @Column(name = "NAME")
    private String name;

    @Column(name = "VALUE")
    private Float value;

    @Column(name = "TYPE")
    private String type;

    @ManyToOne
    @JoinColumn(name = "STUDY_ID")
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property="id")
    private StudyEntity study;
}
