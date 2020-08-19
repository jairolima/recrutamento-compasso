/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Lottie from 'react-lottie';
import animationData from '../../assets/lastload.json';
import logoImg from '../../assets/logo.png';
import { Header, ProfileInfo, Repositories } from './styles';
import api from '../../services/api';

interface ProfileParams {
  login: string;
}

interface Profile {
  name: string;
  bio: string;
  login: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);

  const { params } = useRouteMatch<ProfileParams>();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      api.get(`users/${params.login}`).then(response => {
        setProfile(response.data);
      });
    }, 2000);

    api.get(`users/${params.login}/repos`).then(response => {
      setRepositories(response.data);
    });

    return () => clearInterval(interval);
  }, [params.login]);

  return (
    <>
      <Header>
        <img src={logoImg} width="20%" height="20%" alt="Github Explorer" />
        <Link to="/">
          <FiChevronLeft size={16} />
          <p>Voltar</p>
        </Link>
      </Header>
      {profile ? (
        <>
          <ProfileInfo>
            <header>
              <img src={profile.avatar_url} alt={profile.login} />
              <div>
                <strong>{profile.name}</strong>
                <p>{profile.bio}</p>
              </div>
            </header>
            <ul>
              <li>
                <strong>{profile.public_repos}</strong>
                <span>Repositórios</span>
              </li>
              <li>
                <strong>{profile.followers}</strong>
                <span>Seguidores</span>
              </li>
              <li>
                <strong>{profile.following}</strong>
                <span>Seguindo</span>
              </li>
            </ul>
          </ProfileInfo>

          <Repositories>
            {repositories.map(repository => (
              <a
                key={repository.full_name}
                href={repository.html_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div>
                  <strong>{repository.full_name}</strong>
                  <p>{repository.description}</p>
                </div>

                <FiChevronRight size={20} />
              </a>
            ))}
          </Repositories>
        </>
      ) : (
        <Lottie
          style={{ marginTop: '80px' }}
          options={defaultOptions}
          height="100%"
          width="100%"
        />
      )}
    </>
  );
};

export default Profile;
