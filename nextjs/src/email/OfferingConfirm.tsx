import * as React from 'react';
import { Html, Head, Preview, Body, Container, Text } from '@react-email/components';

export default function OfferingConfirm({
  lang = 'ja',
  item_title,
  method,
  name,
  address,
}: {
  lang?: 'ja' | 'en';
  item_title?: string;
  method: 'in_person' | 'mail' | 'digital';
  name?: string;
  address?: string;
}) {
  const isJa = lang === 'ja';
  return (
    <Html>
      <Head />
      <Preview>{isJa ? '結縁品お申込みを受け付けました' : 'Offering Request Received'}</Preview>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'sans-serif' }}>
        <Container style={{ padding: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 600 }}>
            {isJa ? '東林寺 結縁品お申込みありがとうございます' : 'Thank you for your request'}
          </Text>
          <Text style={{ fontSize: 14 }}>
            {isJa ? '以下の内容で受け付けました。' : 'We’ve received the following:'}
          </Text>
          <Text style={{ fontSize: 14 }}>
            • {isJa ? '品名' : 'Item'}: {item_title || '-'}
            <br />• {isJa ? '方法' : 'Method'}: {method}
            <br />• {isJa ? 'お名前' : 'Name'}: {name || '-'}
            {method === 'mail' ? (
              <>
                <br />• {isJa ? 'ご住所' : 'Address'}: {address || '-'}
              </>
            ) : null}
          </Text>
          <Text style={{ fontSize: 13, color: '#555' }}>
            {isJa
              ? '本メールは自動送信です。ご不明点があればご返信ください。'
              : 'This is an automated email. Reply if you have any questions.'}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
