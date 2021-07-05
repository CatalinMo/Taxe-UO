package com.uo.taxes.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Timestamp;

@Getter
@Setter
@Entity
@Table(name = "paid_fee")
public class PaidFeeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PAID_FEE_ID", unique = true)
    private Long id;

    @Column(name = "NAME")
    private String name;

    @Column(name = "DETAILS")
    private String details;

    @Column(name = "COMMENT")
    private String comment;

    @Column(name = "DATE_OF_PAYMENT")
    private Timestamp dateOfPayment;

    @Column(name = "VALUE")
    private Float value;

    @ManyToOne
    @JoinColumn(name = "ACCOUNT_ID")
    @JsonIgnore
    private AccountEntity account;
}
