import { useState, useEffect } from 'react';

export const useModal = () => {
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  
  // Handle body overflow when modals are open
  useEffect(() => {
    if (mapModalOpen || galleryModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mapModalOpen, galleryModalOpen]);
  
  const openMapModal = (venue) => {
    setSelectedVenue(venue);
    setMapModalOpen(true);
  };
  
  const closeMapModal = () => {
    setMapModalOpen(false);
  };
  
  const openGalleryModal = (venue) => {
    setSelectedVenue(venue);
    setGalleryModalOpen(true);
  };
  
  const closeGalleryModal = () => {
    setGalleryModalOpen(false);
  };
  
  // Close modal when clicking outside
  const handleOutsideClick = (e, modalRef) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeMapModal();
      closeGalleryModal();
    }
  };
  
  return {
    mapModalOpen,
    galleryModalOpen,
    selectedVenue,
    openMapModal,
    closeMapModal,
    openGalleryModal,
    closeGalleryModal,
    handleOutsideClick
  };
};
