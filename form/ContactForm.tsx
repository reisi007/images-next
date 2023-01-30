import { DeepPartial } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import React, { useCallback } from 'react';
import { EmailSubmittable, useSendEmail } from '../host/Rest';
import {
  ExtSubmitHandler, Form, FormChildrenProps, PHONE_REGEXP, Shape,
} from './Form';
import { Styleable } from '../types/Styleable';
import { CheckboxInput, Input, Textarea } from './Input';
import { ActionButton, SubmitButton } from '../button/ActionButton';
import { CommonFormFields, RequiredFormFields } from './Url2Form';

export function ContactForm({
  className,
  style,
  moreOnSubmit,
  ...prefilled
}: DeepPartial<ContactFormMessage> & Partial<Styleable> & { moreOnSubmit?: () => void }) {
  const action = useSendEmail<ContactFormMessage>();
  const submit: ExtSubmitHandler<ContactFormMessage> = useCallback((setErrors, clearErrors, e) => {
    const promise = action(
      setErrors,
      clearErrors,
      undefined,
      e,
    );
    if (moreOnSubmit) return promise.then(moreOnSubmit);
    return promise;
  }, [action, moreOnSubmit]);
  return (
    <div className={className} style={style}>
      <Form<ContactFormMessage> prefilled={prefilled} onSubmit={submit} resolver={contractFormResolver}>
        {(formState, control, getValue, setValue, reset) => <ContactFormContent formState={formState} control={control} getValue={getValue} setValue={setValue} reset={reset} prefilled={prefilled} />}
      </Form>
    </div>
  );
}

function ContactFormContent({
  formState,
  control,
  reset,
  prefilled,
}: FormChildrenProps<ContactFormMessage>) {
  const {
    errors,
    isValid,
    isDirty,
    isSubmitSuccessful,
    isSubmitting,
  } = formState;

  return (
    <>
      {!isSubmitSuccessful && (
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Input label="Vorname" readOnly={!!prefilled?.firstName} control={control} errorMessage={errors.firstName} required className="md:mr-1" name="firstName" />
          <Input label="Nachname" readOnly={!!prefilled?.lastName} control={control} errorMessage={errors.lastName} required className="md:ml-1" name="lastName" />
          <Input label="E-Mail" readOnly={!!prefilled?.email} control={control} errorMessage={errors.email} required name="email" type="email" className="md:col-span-2" />
          <Input label="Handynummer" readOnly={!!prefilled?.tel} control={control} errorMessage={errors.tel} name="tel" type="tel" className="md:col-span-2" />
          <Input readOnly={!!prefilled?.subject} control={control} label="Betreff" required errorMessage={errors.subject} name="subject" type="text" className="md:col-span-2" />
          <Textarea
            readOnly={!!prefilled?.message}
            label="Deine Nachricht an mich"
            rows={5}
            control={control}
            errorMessage={errors.message}
            name="message"
            required
            type="tel"
            className="md:col-span-2"
          />
          <CheckboxInput<ContactFormMessage>
            errorMessage={errors.dsgvo}
            name="dsgvo"
            label="Ich bin damit einverstanden, dass meine Nachricht übertragen wird."
            control={control}
            className="mt-2 md:col-span-2"
          />
          <SubmitButton errors={errors} isSubmitting={isSubmitting} disabled={!isValid || !isDirty || isSubmitting} className="mt-4 bg-primary text-onPrimary md:col-span-2">Absenden</SubmitButton>
        </div>
      )}
      {isSubmitSuccessful && (
        <>
          <h2 className="my-2">Das Formular wurde erfolgreich gesendet. Danke für deine Nachticht!</h2>
          <div className="flex justify-center">
            <ActionButton className="my-1" onClick={reset}>Leeres Formular anzeigen</ActionButton>
          </div>
        </>
      )}
    </>
  );
}

const contractFormResolver = yupResolver(yup.object<Partial<Shape<ContactFormMessage>>>(
  {
    firstName: yup.string()
      .required('Bitte Vorname eingeben'),
    lastName: yup.string()
      .required('Bitte Nachname eingeben'),
    email: yup.string()
      .email('Bitte gib eine gültige E-Mail Adresse ein')
      .required('Bitte Email eingeben'),
    tel: yup.string()
      .matches(PHONE_REGEXP, 'Bitte eine gültige Telefonnummer eingeben'),
    message: yup.string()
      .required('Bitte gib deine Nachricht an mich ein'),
    subject: yup.string()
      .required('Bitte gib einen Betreff ein'),
    dsgvo: yup.boolean()
      .required('Deine Zustimmung zum Senden der Daten ist verpflichtend')
      .isTrue('Deine Zustimmung zum Senden der Daten ist verpflichtend'),
  },
)
  .required());

export type ContactFormMessage = EmailSubmittable & CommonFormFields & RequiredFormFields;
