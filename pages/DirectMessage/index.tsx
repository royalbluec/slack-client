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

const DirectMessage = () => {
  const [chat, onChangeChat, setChat] = useInput('');

  const { workspace, id } = useParams<{ workspace: string; id: string }>();

  const { data: userData } = useSWR(`http://localhost:3095/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR(`http://localhost:3095/api/users`, fetcher);
  const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>(
    `http://localhost:3095/api/workspaces/${workspace}/dms/${id}/chat?perPage=20&page=1`,
    fetcher,
  );

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim()) {
        axios
          .post(
            `http://localhost:3095/api/workspaces/${workspace}/dms/${id}/chats`,
            {
              content: chat,
            },
            {
              withCredentials: true,
            },
          )
          .then((response) => {
            mutateChat(response.data, false);
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
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default DirectMessage;
