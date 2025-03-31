import { useEffect, useState } from "react";

interface QueryResult<T> {
  data?: T;
  isFetching: boolean;
  error?: unknown;
}

interface UseValidationParams<T> {
  value: string;
  originalValue?: string;
  validateQuery: (value: string, options: { skip: boolean }) => QueryResult<T>;
  entityName: string;
  conflictMessage?: string;
}

const useValidation = <T>({
  value,
  originalValue,
  validateQuery,
  entityName,
  conflictMessage = `${entityName} already exists.`,
}: UseValidationParams<T>) => {
  const {
    data: isAvailable,
    isFetching,
    error: queryError,
  } = validateQuery(value, {
    skip: Boolean(!value || (originalValue && value === originalValue)),
  });

  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (isFetching) {
      setIsChecking(true);
      setError("");
      return;
    }

    setIsChecking(false);
    
    if (!value || value === originalValue) {
      setError("");
      return;
    }

    if (queryError) {
      if (typeof queryError === "object" && queryError !== null) {
        if ('status' in queryError && queryError.status === 409) {
          setError(conflictMessage);
        } else if ('message' in queryError) {
          setError((queryError as { message: string }).message);
        } else {
          setError(`An error occurred while validating ${entityName}. Please try again.`);
        }
      } else {
        setError(`An error occurred while validating ${entityName}. Please try again.`);
      }
      return;
    }

    setError("");
  }, [value, originalValue, isFetching, queryError, isAvailable, conflictMessage, entityName]);

  return { error, isChecking };
};

export default useValidation;