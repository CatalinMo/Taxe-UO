package com.uo.taxes.application;

import com.uo.taxes.domain.response.ActiveFeeResponseDto;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Properties;

import static java.time.temporal.ChronoUnit.DAYS;


@Service
@EnableScheduling
@EnableTransactionManagement
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class EmailSender {

    private static final String FROM = "noreplytaxeuo@gmail.com";
    private final AccountServiceApi accountService;

    @Scheduled(cron = "0 0 10 * * ?")
    @Transactional
    public void checkActiveFeesAndSendEmails() {
        List<ActiveFeeResponseDto> activeFees = accountService.getActiveFees();
        activeFees.forEach(this::verifyFeeToSendAnEmail);
    }

    private void verifyFeeToSendAnEmail(ActiveFeeResponseDto activeFee) {
        LocalDateTime limitDate = activeFee.getLimitDate().toLocalDateTime();
        if (DAYS.between(LocalDateTime.now(), limitDate) == 5) {
            sendEmail(activeFee);
        }
    }

    private void sendEmail(ActiveFeeResponseDto activeFee) {
        Properties properties = getProperties();
        Session session = getSession(properties);
        sendEmail(session, activeFee);
    }

    private Properties getProperties() {
        Properties properties = System.getProperties();
        properties.put("mail.smtp.host", "smtp.gmail.com");
        properties.put("mail.smtp.port", "465");
        properties.put("mail.smtp.ssl.enable", "true");
        properties.put("mail.smtp.auth", "true");
        return properties;
    }

    private Session getSession(Properties properties) {
        return Session.getInstance(properties, new javax.mail.Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(FROM, "noreply1234");
            }
        });
    }

    private void sendEmail(Session session, ActiveFeeResponseDto activeFee) {
        try {
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(FROM));
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(activeFee.getAccount().getEmail()));
            message.setSubject(activeFee.getName());
            message.setText("Vă reamintim că mai sunt 5 zile până la termenul limită pentru plătirea taxei:" +
                   " " + activeFee.getName() + "." + " Neplătirea până la termenul limită poate duce la sancțiuni.");
            Transport.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
