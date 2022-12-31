import { DeepPartial, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import React, { useCallback } from 'react';
import { EmailSubmittable, useSendEmail } from '../host/Rest';
import { Form, FormChildrenProps, PHONE_REGEXP } from './Form';
import { Styleable } from '../types/Styleable';
import { Input, Textarea } from './Input';
import { ActionButton, SubmitButton } from '../button/ActionButton';
import { CommonFormFields } from './Url2Form';

export function ContactForm({
  className,
  style,
  moreOnSubmit,
  ...initialValue
}: DeepPartial<ContactFormMessage> & Partial<Styleable> & { moreOnSubmit?: () => void }) {
  const {
    action,
    ...sendEmail
  } = useSendEmail();
  const submit: SubmitHandler<ContactFormMessage> = useCallback(async (e) => {
    if (moreOnSubmit !== undefined) moreOnSubmit();
    action(e);
  }, [action, moreOnSubmit]);
  return (
    <div className={className} style={style}>
      <Form<ContactFormMessage> initialValue={initialValue} onSubmit={submit} resolver={contractFormResolver}>
        {(formState, register, control, setValue, reset) => <ContactFormContent status={sendEmail} formState={formState} register={register} control={control} setValue={setValue} reset={reset} />}
      </Form>
    </div>
  );
}

function ContactFormContent({
  formState,
  register,
  control,
  status,
  reset,
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
          <Input label="Vorname" control={control} errorMessage={errors.firstName} required className="md:mr-1" {...register('firstName')} />
          <Input label="Nachname" control={control} errorMessage={errors.lastName} required className="md:ml-1" {...register('lastName')} />
          <Input label="E-Mail" control={control} errorMessage={errors.email} required {...register('email')} type="email" className="md:col-span-2" />
          <Input label="Handynummer" control={control} errorMessage={errors.tel} {...register('tel')} type="tel" className="md:col-span-2" />
          <Input control={control} label="Betreff" required errorMessage={errors.subject} {...register('subject')} type="text" className="md:col-span-2" />
          <Textarea rows={5} control={control} label="Deine Nachricht an mich" errorMessage={errors.message} {...register('message')} required type="tel" className="md:col-span-2" />
          <SubmitButton status={status} disabled={!isValid || !isDirty || isSubmitting} className="mt-4 bg-primary text-onPrimary md:col-span-2">Absenden</SubmitButton>
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

const contractFormResolver = yupResolver(yup.object(
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
  },
)
  .required());

export type ContactFormMessage = EmailSubmittable & CommonFormFields;
