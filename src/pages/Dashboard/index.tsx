/* eslint-disable camelcase */
import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import logoImg from '../../assets/logo.png';

import { Title, Form, Profiles, Error } from './styles';

interface Profile {
  name: string;
  bio: string;
  login: string;
  avatar_url: string;
}

const Dashboard: React.FC = () => {
  const [newUser, setNewUser] = useState('');
  const [inputError, setInputError] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const storagedProfiles = localStorage.getItem('@githubExplorer:profiles');
    if (storagedProfiles) {
      return JSON.parse(storagedProfiles);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem('@githubExplorer:profiles', JSON.stringify(profiles));
  }, [profiles]);

  async function handleAddProfile(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!newUser) {
      setInputError('Digite o nome do usuário do github');
      return;
    }

    // Adição de um novo usuário
    // Consumir API do Github
    // Salvar novo usuário no estado

    try {
      const response = await api.get<Profile>(`users/${newUser}`);

      const profile = response.data;

      // adicionando ...repositories eu adiciono a nova consulta logo depois da que ja existe
      setProfiles([...profiles, profile]);
      setNewUser('');
      setInputError('');
    } catch (err) {
      setInputError('Erro na busca por esse usuário');
    }
  }

  return (
    <>
      <img width="20%" height="20%" src={logoImg} alt="Github Explorer" />
      <Title>Explore usuários no Github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddProfile}>
        <input
          value={newUser}
          onChange={e => setNewUser(e.target.value)}
          placeholder="Digite o nome do usuário"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Profiles>
        {profiles.map(profile => (
          <Link key={profile.name} to={`/users/${profile.login}/repos`}>
            <img src={profile.avatar_url} alt={profile.login} />
            <div>
              <strong>{profile.name}</strong>
              <p>{profile.bio}</p>
            </div>

            <FiChevronRight size={20} />
          </Link>
        ))}
      </Profiles>
    </>
  );
};

export default Dashboard;
