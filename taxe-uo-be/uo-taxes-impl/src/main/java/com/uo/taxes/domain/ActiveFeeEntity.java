package com.uo.taxes.domain;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Timestamp;

@Getter
@Setter
@Entity
@Table(name = "active_fee")
public class ActiveFeeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ACTIVE_FEE_ID", unique = true)
    private Long id;

    @Column(name = "NAME")
    private String name;

    @Column(name = "DETAILS")
    private String details;

    @Column(name = "COMMENT")
    private String comment;

    @Column(name = "LIMIT_DATE")
    private Timestamp limitDate;

    @Column(name = "VALUE")
    private Float value;

    @ManyToOne
    @JoinColumn(name = "ACCOUNT_ID")
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property="id")
    private AccountEntity account;
}
