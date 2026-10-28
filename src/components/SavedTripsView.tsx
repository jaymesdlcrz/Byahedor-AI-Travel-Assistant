import React from 'react';
import { 
  Heart, 
  Trash2, 
  PlaneTakeoff, 
  MapPin, 
  Calendar, 
  Users, 
  Wallet, 
  ArrowRight, 
  Download, 
  Share2,
  BookmarkCheck,
  CloudCheck,
  LogIn,
  FileText
} from 'lucide-react';
import { TripPlan } from '../types';
import { useAuth } from '../firebase/context';
import { exportTripPlanPdf } from '../utils/pdfExport';

interface SavedTripsViewProps {
  savedTrips: TripPlan[];
  onDeleteTrip: (tripId: string) => void;
  onOpenTrip: (trip: TripPlan) => void;
  onStartPlanning: () => void;
}

export const SavedTripsView: React.FC<SavedTripsViewProps> = ({
  savedTrips,
  onDeleteTrip,
  onOpenTrip,
  onStartPlanning,
}) => {
  const { currentUser, openAuthModal } = useAuth();
  const handleExportSingle = (trip: TripPlan) => {
    exportTripPlanPdf(trip);
  };

  return (
    <div id="byahedor-saved-trips-view" className="space-y-5 pb-8 w-full">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-bold mb-1">
          <Heart className="w-3 h-3 fill-rose-500" />
          <span>Your Bookmarked Journeys</span>
        </div>
        <h1 className="text-fluid-title font-bold text-[#102A43] dark:text-white font-heading">
          Saved Philippine Adventures
        </h1>
        <p className="text-xs text-[#627D98] dark:text-slate-400">
          Access your stored AI itineraries, budget blueprints, and offline day schedules anytime.
        </p>
      </div>

      {/* Firebase Cloud Sync Status Card */}
      <div className={`p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        currentUser 
          ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-800 dark:text-emerald-300' 
          : 'bg-[#087EA4]/10 border-[#087EA4]/20 text-[#087EA4] dark:text-[#4DB8E8]'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            currentUser ? 'bg-emerald-500 text-white' : 'bg-[#087EA4] text-white'
          }`}>
            <CloudCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold">
              {currentUser ? 'Firebase Cloud Sync Active' : 'Enable Firebase Cloud Sync'}
            </p>
            <p className="text-[11px] opacity-80">
              {currentUser 
                ? `Backed up automatically to Firebase Firestore (${currentUser.email})` 
                : 'Sign in to access your saved itineraries from any phone, tablet, or browser'}
            </p>
          </div>
        </div>

        {!currentUser && (
          <button
            onClick={() => openAuthModal('signin')}
            className="self-start sm:self-auto min-h-[36px] px-3.5 py-1.5 rounded-xl bg-[#087EA4] hover:bg-[#076c8c] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>

      {savedTrips.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#0f233a] rounded-2xl border border-[#E4E9F0] dark:border-slate-800 p-6 space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#102A43] dark:text-white font-heading">
            No saved trips yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            When you create an AI itinerary in the Trip Planner, tap "Save Trip" to bookmark it for future adventures.
          </p>
          <button
            onClick={onStartPlanning}
            className="min-h-[42px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#087EA4] to-[#39A96B] hover:opacity-95 text-white font-bold text-xs shadow-2xs transition-all inline-flex items-center gap-1.5 active:scale-95"
          >
            <span>Plan a New Trip Now</span>
            <PlaneTakeoff className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white dark:bg-[#0f233a] rounded-2xl overflow-hidden border border-[#E4E9F0] dark:border-slate-800 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={trip.coverImage}
                    alt={trip.destination}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 border border-white/20">
                    <BookmarkCheck className="w-3 h-3 text-emerald-400" />
                    <span>Saved Itinerary</span>
                  </span>

                  <button
                    onClick={() => onDeleteTrip(trip.id)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-lg bg-black/60 hover:bg-rose-600 text-white backdrop-blur-md transition-colors flex items-center justify-center active:scale-95"
                    title="Remove from saved"
                    aria-label="Remove trip"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <h3 className="font-bold text-base font-heading drop-shadow-xs truncate">
                      {trip.title}
                    </h3>
                    <span className="text-[11px] text-[#FFB84D] flex items-center gap-1">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span>{trip.destination}</span>
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3.5 space-y-3">
                  <p className="text-[11px] text-[#486581] dark:text-slate-300 line-clamp-2 leading-relaxed font-medium">
                    {trip.overview}
                  </p>

                  <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-[#E4E9F0] dark:border-slate-800 text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase">Duration</span>
                      <span className="font-bold text-[#102A43] dark:text-white text-xs">
                        {trip.days}d / {trip.travelers}p
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase">Budget</span>
                      <span className="font-extrabold text-[#087EA4] dark:text-[#4DB8E8] text-xs">
                        ₱{trip.totalBudget.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3.5 pt-0 grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleExportSingle(trip)}
                  className="min-h-[38px] py-1.5 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1 active:scale-95"
                  title="Export Itinerary as PDF Document"
                >
                  <FileText className="w-3.5 h-3.5 text-[#087EA4]" />
                  <span>Export PDF</span>
                </button>

                <button
                  onClick={() => onOpenTrip(trip)}
                  className="min-h-[38px] py-1.5 px-2.5 rounded-lg bg-[#087EA4] hover:bg-[#076c8c] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 shadow-2xs active:scale-95"
                >
                  <span>Open Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
