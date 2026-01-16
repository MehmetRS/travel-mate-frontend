import ChatClient from '@/features/chat/ChatClient';

export default function Page({ params }: { params: { id: string } }) {
  return <ChatClient chatId={params.id} />;
}
