import React, { useEffect, useRef, useState } from 'react';
import {
  ButtonsContainer,
  CloseButton,
  ConfirmButton,
  ControllerWrapper,
  InfoText,
  OptionsGrid,
  PageSizeOption,
  PopupHeader,
  StyledPageSizeController,
  StyledPopup,
} from './style';
import { ChevronDown, Settings, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

interface props {
  pageSize: number;
  setQueryParams: any;
  options?: number[];
}
export function PageSizeController({ pageSize, setQueryParams, options = [10, 20, 30, 50] }: props) {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<number>(pageSize);
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const popupRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (controllerRef.current && controllerRef.current.contains(event.target as Node)) {
        return;
      }

      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (size: number) => {
    setSelectedSize(size);
  };

  const handleConfirm = () => {
    searchParams.set('pageSize', selectedSize.toString());
    setSearchParams(searchParams);
    setQueryParams({ PageSize: selectedSize });
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(!open);
    if (!open) {
      setSelectedSize(pageSize);
    }
  };

  return (
    <ControllerWrapper>
      <StyledPageSizeController ref={controllerRef} onClick={handleToggle}>
        <Settings size={20} style={{ marginRight: '8px' }} />
        <div>
          {pageSize}&nbsp;{t('element')}
        </div>
        <ChevronDown
          size={16}
          style={{
            marginLeft: '4px',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 300ms ease',
          }}
        />
      </StyledPageSizeController>

      {open && (
        <StyledPopup ref={popupRef} className={open ? 'open' : ''}>
          <PopupHeader>{t('change_page_size')}</PopupHeader>

          <OptionsGrid>
            {options.map((option) => (
              <PageSizeOption key={option} selected={selectedSize === option} onClick={() => handleSelect(option)}>
                {option}
              </PageSizeOption>
            ))}
          </OptionsGrid>

          <InfoText>
            {t('current_page_size ')}&nbsp;{selectedSize}
          </InfoText>

          <ButtonsContainer>
            <CloseButton onClick={() => setOpen(false)}>
              <X size={16} />
            </CloseButton>

            <ConfirmButton onClick={handleConfirm}>
              {selectedSize}&nbsp;{t('select_page')}
            </ConfirmButton>
          </ButtonsContainer>
        </StyledPopup>
      )}
    </ControllerWrapper>
  );
}
