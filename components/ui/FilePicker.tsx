"use client";

import { useId, useRef, type ChangeEvent } from "react";

type Props = {
  accept?: string;
  onChange: (file: File | null) => void;
  fileName?: string | null;
  label?: string;
  className?: string;
};

/** Highlighted custom file picker (native control stays hidden) */
export function FilePicker({
  accept,
  onChange,
  fileName,
  label = "Elegir archivo",
  className = "",
}: Props) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.files?.[0] ?? null);
  }

  return (
    <div className={`fc-file-picker ${className}`}>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={handleChange}
      />
      <label htmlFor={id} className="fc-file-picker__btn">
        <span className="material-symbols-outlined text-[18px] leading-none">
          upload_file
        </span>
        <span>{label}</span>
      </label>
      {fileName ? (
        <p className="fc-file-picker__name" title={fileName}>
          {fileName}
        </p>
      ) : (
        <p className="fc-file-picker__hint">Ningún archivo seleccionado</p>
      )}
    </div>
  );
}
