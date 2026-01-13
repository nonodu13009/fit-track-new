"use client";

import { useState } from "react";
import { Card, Badge, Loading, Button, AlertDialog } from "@/components/ui";
import { CreateTemplateModal } from "@/components/features/CreateTemplateModal";
import { CreateEventModal } from "@/components/features/CreateEventModal";
import { useTemplates } from "@/hooks/useTemplates";
import { deleteDocument } from "@/lib/firebase/firestore";
import { useToastContext } from "@/components/providers/ToastProvider";
import { useAlertDialog } from "@/hooks/useAlertDialog";
import { Plus, Barbell, Clock, Trash, Play, Share } from "@phosphor-icons/react";
import { shareContent, formatTemplateForShare } from "@/lib/utils/share";

export default function TemplatesPage() {
  const { templates, loading } = useTemplates();
  const toast = useToastContext();
  const { alertState, showAlert, closeAlert, confirmAlert } = useAlertDialog();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handlePlanTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setIsPlanModalOpen(true);
  };

  const handleShare = async (template: any) => {
    const success = await shareContent(formatTemplateForShare(template));
    if (success) {
      toast.success("Template partagé !");
    } else {
      toast.info("Texte copié dans le presse-papier");
    }
  };

  const handleDelete = async (templateId: string) => {
    showAlert(
      "Êtes-vous sûr de vouloir supprimer ce template ?",
      async () => {
        setDeletingId(templateId);
        try {
          await deleteDocument("workoutTemplates", templateId);
          toast.success("Template supprimé");
        } catch (error) {
          console.error("Erreur lors de la suppression:", error);
          toast.error("Erreur lors de la suppression");
        } finally {
          setDeletingId(null);
        }
      },
      {
        title: "Supprimer le template",
        variant: "danger",
      }
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loading size="lg" color="purple" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gradient">Templates</h1>
        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
          icon={<Plus size={16} weight="bold" />}
        >
          Créer
        </Button>
      </div>

      {templates.length === 0 ? (
        <Card variant="glass">
          <div className="py-12 text-center">
            <Barbell
              size={48}
              weight="fill"
              className="mx-auto mb-4 text-gray-600"
            />
            <p className="mb-2 text-lg font-medium text-gray-400">
              Aucun template créé
            </p>
            <p className="mb-4 text-sm text-gray-500">
              Créez des templates pour planifier rapidement vos séances
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              icon={<Plus size={20} weight="bold" />}
            >
              Créer mon premier template
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card
              key={template.id}
              variant="elevated"
              className="transition-colors hover:border-accent-purple/50"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="mb-1 text-lg font-semibold text-white">
                    {template.name}
                  </h3>
                  <Badge variant="purple" size="sm">
                    {template.sport}
                  </Badge>
                </div>
                <button
                  onClick={() => handleShare(template)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-accent-cyan/10 hover:text-accent-cyan"
                  aria-label="Partager"
                >
                  <Share size={18} weight="bold" />
                </button>
              </div>

              <div className="mb-4 flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock size={16} weight="bold" />
                  <span>{template.duration} min</span>
                </div>
              </div>

              {template.description && (
                <p className="mb-4 text-sm text-gray-300">
                  {template.description}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2 border-t border-white/10 pt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  icon={<Play size={16} weight="fill" />}
                  onClick={() => handlePlanTemplate(template.id)}
                >
                  Planifier
                </Button>
                <button
                  onClick={() => handleDelete(template.id)}
                  disabled={deletingId === template.id}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                  aria-label="Supprimer"
                >
                  <Trash size={18} weight="bold" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Création Template */}
      <CreateTemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Modal Planification (à partir d'un template) */}
      <CreateEventModal
        isOpen={isPlanModalOpen}
        onClose={() => {
          setIsPlanModalOpen(false);
          setSelectedTemplateId("");
        }}
      />

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        onConfirm={confirmAlert}
        title={alertState.title}
        message={alertState.message}
        variant={alertState.variant}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}
