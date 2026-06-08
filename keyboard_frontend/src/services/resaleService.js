import api from '../api/axios';

// ─── Resale Categories ────────────────────────────────────────────────────────
export const fetchResaleCategories = (params = {}) =>
  api.get('/resale/categories', { params });

export const fetchResaleCategory = (id, params = {}) =>
  api.get(`/resale/categories/${id}`, { params });

// ─── Resale Listings ──────────────────────────────────────────────────────────
export const fetchResaleListings = (params = {}) =>
  api.get('/resale/listings', { params });

export const fetchResaleListing = (id) =>
  api.get(`/resale/listings/${id}`);

export const createResaleListing = (formData) =>
  api.post('/resale/listings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateResaleListing = (id, formData) => {
  formData.append('_method', 'PUT');
  return api.post(`/resale/listings/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteResaleListing = (id) =>
  api.delete(`/resale/listings/${id}`);

export const uploadResaleImage = (listingId, file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post(`/resale/listings/${listingId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteResaleImage = (imageId) =>
  api.delete(`/resale/listings/images/${imageId}`);

export const markListingSold = (id) =>
  api.patch(`/resale/listings/${id}/sold`);

export const markListingReserved = (id) =>
  api.patch(`/resale/listings/${id}/reserved`);

export const renewListing = (id) =>
  api.patch(`/resale/listings/${id}/renew`);

// ─── Favorites ────────────────────────────────────────────────────────────────
export const fetchMyFavorites = () =>
  api.get('/resale/favorites');

export const toggleFavorite = (listingId) =>
  api.post(`/resale/listings/${listingId}/favorite`);

// ─── Conversations ────────────────────────────────────────────────────────────
export const fetchConversations = (params = {}) =>
  api.get('/resale/conversations', { params });

export const fetchConversation = (id) =>
  api.get(`/resale/conversations/${id}`);

export const createConversation = (listingId, body) =>
  api.post(`/resale/listings/${listingId}/conversations`, { body });

// ─── Messages ─────────────────────────────────────────────────────────────────
export const fetchMessages = (conversationId, params = {}) =>
  api.get(`/resale/conversations/${conversationId}/messages`, { params });

export const sendMessage = (conversationId, body, attachments = null) => {
  const formData = new FormData();
  formData.append('body', body);
  if (attachments) {
    attachments.forEach((file) => formData.append('attachments[]', file));
  }
  return api.post(`/resale/conversations/${conversationId}/messages`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const markConversationRead = (conversationId) =>
  api.patch(`/resale/conversations/${conversationId}/messages/read`);

// ─── Offers ───────────────────────────────────────────────────────────────────
export const fetchOffers = (params = {}) =>
  api.get('/resale/offers', { params });

export const createOffer = (listingId, data) =>
  api.post(`/resale/listings/${listingId}/offers`, data);

export const acceptOffer = (offerId) =>
  api.patch(`/resale/offers/${offerId}/accept`);

export const rejectOffer = (offerId) =>
  api.patch(`/resale/offers/${offerId}/reject`);

export const counterOffer = (offerId, data) =>
  api.patch(`/resale/offers/${offerId}/counter`, data);

export const withdrawOffer = (offerId) =>
  api.patch(`/resale/offers/${offerId}/withdraw`);

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const fetchReviews = (params = {}) =>
  api.get('/resale/reviews', { params });

export const fetchUserReviews = (userId, params = {}) =>
  api.get(`/resale/reviews/user/${userId}`, { params });

export const createReview = (data) =>
  api.post('/resale/reviews', data);

// ─── Reports ──────────────────────────────────────────────────────────────────
export const createReport = (listingId, data) =>
  api.post(`/resale/listings/${listingId}/reports`, data);

// ─── Notifications ────────────────────────────────────────────────────────────
export const fetchNotifications = (params = {}) =>
  api.get('/resale/notifications', { params });

export const fetchUnreadNotifications = () =>
  api.get('/resale/notifications/unread');

export const fetchUnreadNotificationCount = () =>
  api.get('/resale/notifications/unread-count');

export const markNotificationRead = (id) =>
  api.patch(`/resale/notifications/${id}/read`);

export const markAllNotificationsRead = () =>
  api.patch('/resale/notifications/read-all');
