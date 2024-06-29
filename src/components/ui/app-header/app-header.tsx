import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import { Link } from 'react-router-dom';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName, path }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <Link to={'/'}>
          <BurgerIcon type={`${path === '/' ? 'primary' : 'secondary'}`} />
          <p
            className={`text text_type_main-default ml-2 mr-10 ${path === '/' ? styles.link_active : styles.link}`}
          >
            Конструктор
          </p>
        </Link>
        <Link to={'/feed'}>
          <ListIcon type={`${path === '/feed' ? 'primary' : 'secondary'}`} />
          <p
            className={`text text_type_main-default ml-2 ${path === '/feed' ? styles.link_active : styles.link}`}
          >
            Лента заказов
          </p>
        </Link>
      </div>
      <div className={styles.logo}>
        <Link to={'/'}>
          <Logo className='' />
        </Link>
      </div>
      <div className={styles.link_position_last}>
        <Link to={'/profile'}>
          <ProfileIcon
            type={`${path?.includes('profile') ? 'primary' : 'secondary'}`}
          />
          <p
            className={`text text_type_main-default ml-2 ${path?.includes('profile') ? styles.link_active : styles.link}`}
          >
            {userName || 'Личный кабинет'}
          </p>
        </Link>
      </div>
    </nav>
  </header>
);
