
import { useRouter } from 'next/router';
import { GetServerSideProps, GetStaticProps, InferGetServerSidePropsType, InferGetStaticPropsType } from 'next/types';
import React from 'react';
import { ReactNode, useEffect, useState } from 'react'
import { useAuth } from './auth/AuthContext';
import AuthForm from './AuthForm';
import ConfirmationView from './ConfirmationView';
import Container from './container/Container';
import Sidebar from './sidebar/Sidebar';
import { useUI } from "./UIContext";
import MainFrame from './utils/MainFrame';
import Modal from './utils/Modal';


interface LayoutProps {
	children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {


	const ModalView: React.FC<{ modalView: string; closeModal(): any }> = ({
		modalView,
		closeModal,
	}) => {

		return (
			<Modal onClose={closeModal}>
				{modalView === 'LOGIN_VIEW' && <AuthForm isSignIn={true} />}
				{modalView === 'REGISTER_VIEW' && <AuthForm isSignIn={false} />}
				{modalView === 'CONFIRMED_REGISTER_VIEW' && <ConfirmationView message="An verification email was sent. Verify your account before connecting" />}
			</Modal>
		)
	}

	const ModalUI: React.FC = () => {
		const { closeModal, modalView } = useUI()
		return (
			<ModalView modalView={modalView} closeModal={closeModal} />
		)
	}


	const { user, loading } = useAuth();
	const { setModalView, openModal, closeModal } = useUI();



	useEffect(() => {
		console.log('isLoggedIn', user, loading)
		if (!loading && user == null || user.email == null) {
			setModalView('LOGIN_VIEW');
			openModal();
		} else {
			closeModal();
		}
	}, [user, openModal, setModalView])

	return (
		<div className="bg-gray-100 min-h-screen min-w-screen">
			<MainFrame>
				{children}
			</MainFrame>
			<ModalUI />
		</div>
	)
}


export default Layout
