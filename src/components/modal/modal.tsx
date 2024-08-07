import { FC, memo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from '../../services/store';
import { TModalProps } from './type';
import { ModalUI } from '@ui';
import { orderSlice } from '../../services/orderSlicer';

const modalRoot = document.getElementById('modals');

export const Modal: FC<TModalProps> = memo(({ title, onClose, children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      e.key === 'Escape' && onClose();
    };

    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <ModalUI title={title} onClose={onClose}>
      {children}
    </ModalUI>,
    modalRoot as HTMLDivElement
  );
});
