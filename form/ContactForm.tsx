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
  ...initialValue
}: DeepPartial<ContactFormMessage> & Partial<Styleable> & { moreOnSubmit?: () => void }) {
  const action = useSendEmail<ContactFormMessage>();
  const submit: ExtSubmitHandler<ContactFormMessage> = useCallback((e, setErrors, clearErrors) => {
    if (moreOnSubmit !== undefined) moreOnSubmit();
    return action(e, setErrors, clearErrors);
  }, [action, moreOnSubmit]);
  return (
    <div className={className} style={style}>
      <Form<ContactFormMessage> initialValue={initialValue} onSubmit={submit} resolver={contractFormResolver}>
        {(formState, register, control, setValue, reset) => <ContactFormContent formState={formState} register={register} control={control} setValue={setValue} reset={reset} />}
      </Form>
    </div>
  );
}

function ContactFormContent({
  formState,
  register,
  control,
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
          <CheckboxInput {...register('dsgvo')} label="Ich bin damit einverstanden, dass meine Nachricht übertragen wird." control={control} required className="mt-2 md:col-span-2" />
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
      .required('Deine Zustimmung zum Senden der Daten ist verpflichtend'),
  },
)
  .required());

export type ContactFormMessage = EmailSubmittable & CommonFormFields & RequiredFormFields;
