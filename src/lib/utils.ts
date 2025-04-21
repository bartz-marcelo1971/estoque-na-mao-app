import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Funções de manipulação de datas
 */

/**
 * Formata uma string de data para o formato DD/MM/AAAA
 * @param dateString A string de data a ser formatada (pode ser DDMMAAAA ou já formatada)
 * @returns String formatada em DD/MM/AAAA ou "Não especificada" se vazia
 */
export function formatExpiryDate(dateString?: string): string {
  if (!dateString) return "Não especificada";

  // Se já estiver formatada com barras, retorna como está
  if (dateString.includes('/')) return dateString;

  // Remove caracteres não numéricos
  const numbersOnly = dateString.replace(/\D/g, '');
  if (!numbersOnly) return "Não especificada";

  let formattedDate = '';

  if (numbersOnly.length > 0) {
    formattedDate += numbersOnly.substring(0, 2);
  }
  if (numbersOnly.length > 2) {
    formattedDate += '/' + numbersOnly.substring(2, 4);
  }
  if (numbersOnly.length > 4) {
    formattedDate += '/' + numbersOnly.substring(4, 8);
  }

  return formattedDate || "Não especificada";
}

/**
 * Aplica máscara de formatação para entrada de data (DD/MM/AAAA)
 * @param value O valor atual do campo de entrada
 * @returns String formatada com a máscara aplicada
 */
export function applyDateMask(value: string): string {
  // Remove caracteres não numéricos
  const numbersOnly = value.replace(/\D/g, '');

  let formattedDate = '';

  if (numbersOnly.length > 0) {
    // Limita o dia entre 01-31
    const day = parseInt(numbersOnly.substring(0, 2));
    if (numbersOnly.length >= 2) {
      formattedDate += (day > 31 ? '31' : day < 1 ? '01' : numbersOnly.substring(0, 2));
    } else {
      formattedDate += numbersOnly.substring(0, 2);
    }
  }

  if (numbersOnly.length > 2) {
    // Limita o mês entre 01-12
    const month = parseInt(numbersOnly.substring(2, 4));
    formattedDate += '/' + (month > 12 ? '12' : month < 1 ? '01' : numbersOnly.substring(2, 4));
  }

  if (numbersOnly.length > 4) {
    formattedDate += '/' + numbersOnly.substring(4, 8);
  }

  return formattedDate;
}

/**
 * Verifica se uma data é válida no formato DD/MM/AAAA
 * @param dateString String de data a ser validada
 * @returns true se a data é válida, false caso contrário
 */
export function isValidDate(dateString: string): boolean {
  if (!dateString) return false;

  // Verifica o formato DD/MM/AAAA
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateString.match(regex);

  if (!match) return false;

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  // Verifica limites básicos
  if (month < 1 || month > 12) return false;
  if (day < 1) return false;

  // Verifica o número de dias para o mês
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) return false;

  return true;
}

/**
 * Converte uma data no formato DD/MM/AAAA para o formato ISO (AAAA-MM-DD)
 * @param dateString String de data no formato DD/MM/AAAA
 * @returns String no formato AAAA-MM-DD ou null se a data for inválida
 */
export function convertToISODate(dateString: string): string | null {
  if (!dateString || !isValidDate(dateString)) return null;

  const parts = dateString.split('/');
  if (parts.length !== 3) return null;

  const day = parts[0];
  const month = parts[1];
  const year = parts[2];

  return `${year}-${month}-${day}`;
}

/**
 * Converte uma data no formato ISO (AAAA-MM-DD) para o formato DD/MM/AAAA
 * @param isoDateString String de data no formato AAAA-MM-DD
 * @returns String no formato DD/MM/AAAA ou vazio se a data for inválida
 */
export function convertFromISODate(isoDateString: string | null): string {
  if (!isoDateString) return '';

  // Verifica se está no formato ISO
  const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
  const match = isoDateString.match(regex);

  if (!match) return isoDateString; // Retorna original se não estiver no formato ISO

  const year = match[1];
  const month = match[2];
  const day = match[3];

  return `${day}/${month}/${year}`;
}
