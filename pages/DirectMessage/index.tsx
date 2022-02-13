import React, { useCallback } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import gravatar from 'gravatar';
import { useParams } from 'react-router';
import { Container, Header } from '@pages/Channel/styles';

import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import fetcher from '@utils/fetcher';
import { IDM } from '@typings/db';

const backUrl = 'http://localhost:3095';

const DirectMessage = () => {
  const [chat, onChangeChat, setChat] = useInput('');

  const { workspace, id } = useParams<{ workspace: string; id: string }>();

  const { data: userData } = useSWR(`${backUrl}/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR(`${backUrl}/api/users`, fetcher);
  const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>(
    `${backUrl}/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    fetcher,
  );

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim()) {
        axios
          .post(
            `${backUrl}/api/workspaces/${workspace}/dms/${id}/chats`,
            {
              content: chat,
            },
            {
              withCredentials: true,
            },
          )
          .then(() => {
            mutateChat();
            setChat('');
          })
          .catch(console.error);
      }
    },
    [chat],
  );

  if (!userData || !myData) {
    return null;
  }

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList chatData={chatData} />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default DirectMessage;
