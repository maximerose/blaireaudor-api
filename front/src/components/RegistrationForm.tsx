import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api/config';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    display_name: '',
    username: '',
    plain_password: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUsernameCustomized, setIsUsernameCustomized] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null,
  );
  const [checkLoading, setCheckLoading] = useState(false);

  useEffect(() => {
    if (!formData.username || formData.username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setCheckLoading(true);
      try {
        const response = await apiFetch(`/check-username/${formData.username}`);
        const data = await response.json();
        setUsernameAvailable(data.available);
      } catch (e) {
        console.error('Erreur check username', e);
      } finally {
        setCheckLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [formData.username]);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUsernameAvailable(null);

    const newFormData = { ...formData, display_name: val };

    if (!isUsernameCustomized) {
      newFormData.username = slugify(val);
    }

    setFormData(newFormData);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUsernameCustomized(true);
    setUsernameAvailable(null);
    setFormData({ ...formData, username: slugify(e.target.value) });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;
    setIsLoading(true);
    setMessage('');

    try {
      const response = await apiFetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('🏆 Inscription réussie ! Tu peux maintenant te connecter.');
      } else {
        setMessage(result.message || '❌ Une erreur est survenue.');
      }
    } catch (error) {
      console.error("Erreur d'inscription :", error);
      setMessage('📡 Erreur de connexion au serveur.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-gold/20 shadow-2xl w-full"
    >
      <h2 className="text-3xl font-bold text-gold mb-6 text-center">
        S'inscrire
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-gold/80 text-sm mb-1">
            Nom d'affichage
          </label>
          <input
            type="text"
            value={formData.display_name || ''}
            onChange={handleDisplayNameChange}
            className="w-full bg-dark border text-gold border-gold/30 rounded-lg px-4 py-2 focus:outline-none focus:border-gold transition-colors text-center"
            required
          />
        </div>

        <div>
          <label className="block text-gold/80 text-sm mb-1">
            Nom d'utilisateur
          </label>
          <input
            type="text"
            value={formData.username || ''}
            onChange={handleUsernameChange}
            className="w-full bg-dark border text-gold border-gold/30 rounded-lg px-4 py-2 focus:outline-none focus:border-gold transition-colors text-center"
            required
          />
          {formData.username.length >= 3 && (
            <div className="text-xs mt-1 text-center">
              {checkLoading && (
                <span className="text-gold animate-pulse">Vérification...</span>
              )}
              {usernameAvailable === true && (
                <span className="text-green-500">✅ Pseudo libre !</span>
              )}
              {usernameAvailable === false && (
                <span className="text-red-500">❌ Déjà pris !</span>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-gold/80 text-sm mb-1">
            Mot de passe
          </label>
          <input
            type="password"
            value={formData.plain_password || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                plain_password: e.target.value,
              })
            }
            className="w-full bg-dark border text-gold border-gold/30 rounded-lg px-4 py-2 focus:outline-none focus:border-gold transition-colors text-center"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 font-bold rounded-lg transition-all 
            ${
              isLoading
                ? 'bg-gold/50 cursor-not-allowed opacity-70'
                : 'bg-gold text-dark hover:bg-gold/90 active:scale-95 shadow-lg shadow-gold/20'
            }`}
        >
          {isLoading
            ? 'Inscription en cours...'
            : "S'inscrire au Blaireau d'Or"}
        </button>
      </div>

      {message && (
        <p className="mt-4 text-center text-sm text-white font-medium">
          {message}
        </p>
      )}
    </form>
  );
};

export default RegistrationForm;
