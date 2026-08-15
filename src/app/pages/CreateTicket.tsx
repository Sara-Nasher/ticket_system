import React, { useState } from 'react';
import { Form, Input, Select, Steps, Upload, Row, Col, App } from 'antd';
import { UploadOutlined, ArrowRightOutlined, SendOutlined } from '@ant-design/icons';
import { useApp } from '../context/AppContext';
import { UserLayout, Panel, PgHeader, Btn, GBtn, lbSt, inSt, PrTag } from '../components/Layouts';
import { ticketService } from '../../services/ticket';
import type { Priority, TicketStatus, TicketRec } from '../types';

const { TextArea } = Input;

const CreateTicket: React.FC = () => {
  const { message } = App.useApp();
  const { i, navigate, isRTL, auth } = useApp();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [form] = Form.useForm();

  const [ticketData, setTicketData] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    desc: '',
  });

  const cats = [
    { value: "technical", label: i.technical },
    { value: "billing", label: i.billing },
    { value: "general", label: i.generalQ },
    { value: "feature", label: i.featureReq },
    { value: "other", label: i.other },
  ];

  const pris = [
    { value: "low", label: i.low },
    { value: "medium", label: i.medium },
    { value: "high", label: i.high },
    { value: "urgent", label: i.urgent },
  ];

  const goToNextStep = () => {
    if (step === 0) {
      const subject = form.getFieldValue('subject');
      const category = form.getFieldValue('category');
      const priority = form.getFieldValue('priority');
      
      console.log('🔍 Step 0 - Subject:', subject);
      console.log('🔍 Step 0 - Category:', category);
      console.log('🔍 Step 0 - Priority:', priority);
      
      if (!subject || subject.trim().length < 5) {
        message.error('لطفاً موضوع تیکت را وارد کنید (حداقل ۵ کاراکتر)');
        return;
      }
      if (!category) {
        message.error('لطفاً دسته‌بندی را انتخاب کنید');
        return;
      }
      if (!priority) {
        message.error('لطفاً اولویت را انتخاب کنید');
        return;
      }
      
      setTicketData(prev => ({
        ...prev,
        subject: subject.trim(),
        category,
        priority,
      }));
      
      setStep(1);
    } else if (step === 1) {
      const desc = form.getFieldValue('desc');
      
      console.log('🔍 Step 1 - Desc:', desc);
      
      if (!desc || desc.trim().length < 20) {
        message.error('لطفاً توضیحات را وارد کنید (حداقل ۲۰ کاراکتر)');
        return;
      }
      
      setTicketData(prev => ({
        ...prev,
        desc: desc.trim(),
      }));
      
      setStep(2);
    }
  };

  const submit = async () => {
    setLoading(true);
    try {
      console.log('📝 Ticket data from state:', ticketData);
      
      if (!ticketData.subject || ticketData.subject.trim().length < 5) {
        message.error('لطفاً موضوع تیکت را وارد کنید');
        setLoading(false);
        return;
      }

      const newTicket: Partial<TicketRec> = {
        subject: ticketData.subject.trim(),
        subjectFa: ticketData.subject.trim(),
        category: ticketData.category || 'general',
        status: 'open' as TicketStatus,
        priority: ticketData.priority as Priority, // ✅ تبدیل به نوع Priority
        userId: Number(auth?.id) || 1,
        userName: auth?.name || 'کاربر',
        userNameFa: auth?.nameFa || auth?.name || 'کاربر',
        desc: ticketData.desc || '',
        descFa: ticketData.desc || '',
        assignee: '',
        replies: 0,
        responses: [],
      };

      console.log('📤 Sending ticket data:', JSON.stringify(newTicket, null, 2));
      
      const result = await ticketService.createTicket(newTicket);
      console.log('✅ Ticket created with subject:', result.subject);
      
      message.success(i.ticketCreated || 'تیکت با موفقیت ایجاد شد');
      navigate("my-tickets");
    } catch (error: any) {
      console.error('❌ Error creating ticket:', error);
      message.error(error.message || 'خطا در ایجاد تیکت');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTicketData(prev => ({
      ...prev,
      subject: e.target.value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setTicketData(prev => ({
      ...prev,
      category: value,
    }));
  };

  const handlePriorityChange = (value: string) => {
    setTicketData(prev => ({
      ...prev,
      priority: value,
    }));
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTicketData(prev => ({
      ...prev,
      desc: e.target.value,
    }));
  };

  return (
    <UserLayout>
      <PgHeader
        crumbs={[
          { label: i.dashboard, page: "dashboard" },
          { label: i.myTickets, page: "my-tickets" },
          { label: i.newTicket },
        ]}
        title={i.newTicket}
        sub={i.supportResponse}
      />
      <Row gutter={[20, 0]}>
        <Col xs={24} lg={16}>
          <Panel>
            <Steps
              current={step}
              style={{ marginBottom: 26 }}
              items={[
                { title: i.stepDetails },
                { title: i.stepDesc2 },
                { title: i.stepAttach },
              ]}
            />
            <Form 
              form={form} 
              layout="vertical"
              initialValues={{
                category: 'general',
                priority: 'medium'
              }}
            >
              {step === 0 && (
                <>
                  <Form.Item
                    label={<span style={lbSt}>{i.subject}</span>}
                    name="subject"
                    rules={[
                      { required: true, message: 'لطفاً موضوع تیکت را وارد کنید' },
                      { min: 5, message: 'موضوع باید حداقل ۵ کاراکتر باشد' }
                    ]}
                  >
                    <Input 
                      size="large" 
                      style={inSt} 
                      placeholder={i.issueSummary || 'خلاصه مشکل را وارد کنید'}
                      onChange={handleSubjectChange}
                      value={ticketData.subject}
                    />
                  </Form.Item>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label={<span style={lbSt}>{i.category}</span>}
                        name="category"
                        rules={[{ required: true, message: 'لطفاً دسته‌بندی را انتخاب کنید' }]}
                      >
                        <Select 
                          size="large" 
                          placeholder={i.selectCat} 
                          options={cats}
                          onChange={handleCategoryChange}
                          value={ticketData.category}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label={<span style={lbSt}>{i.priority}</span>}
                        name="priority"
                        rules={[{ required: true, message: 'لطفاً اولویت را انتخاب کنید' }]}
                      >
                        <Select 
                          size="large" 
                          placeholder={i.selectPri} 
                          options={pris}
                          onChange={handlePriorityChange}
                          value={ticketData.priority}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Btn onClick={goToNextStep}>
                      {i.next} <ArrowRightOutlined />
                    </Btn>
                  </div>
                </>
              )}
              {step === 1 && (
                <>
                  <Form.Item
                    label={<span style={lbSt}>{i.description}</span>}
                    name="desc"
                    rules={[
                      { required: true, message: 'لطفاً توضیحات را وارد کنید' },
                      { min: 20, message: 'توضیحات باید حداقل ۲۰ کاراکتر باشد' }
                    ]}
                  >
                    <TextArea 
                      rows={8} 
                      placeholder={i.descPlaceholder} 
                      style={{ ...inSt, resize: "none" }}
                      onChange={handleDescChange}
                      value={ticketData.desc}
                    />
                  </Form.Item>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <GBtn onClick={() => setStep(0)}>
                      ← {i.back}
                    </GBtn>
                    <Btn onClick={goToNextStep}>
                      {i.next} <ArrowRightOutlined />
                    </Btn>
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <Form.Item label={<span style={lbSt}>{i.attachments}</span>}>
                    <Upload.Dragger
                      multiple
                      maxCount={5}
                      style={{
                        background: "rgba(59,130,246,.04)",
                        border: "1px dashed rgba(59,130,246,.25)",
                        borderRadius: 12,
                      }}
                    >
                      <p style={{ fontSize: 28, color: "#3b82f6" }}>
                        <UploadOutlined />
                      </p>
                      <p style={{ color: "var(--av-text2)", fontSize: 13 }}>{i.dropFiles}</p>
                      <p style={{ color: "var(--av-text4)", fontSize: 11 }}>{i.fileHint}</p>
                    </Upload.Dragger>
                  </Form.Item>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <GBtn onClick={() => setStep(1)}>
                      ← {i.back}
                    </GBtn>
                    <Btn loading={loading} onClick={submit} icon={<SendOutlined />}>
                      {i.submit}
                    </Btn>
                  </div>
                </>
              )}
            </Form>
          </Panel>
        </Col>
        <Col xs={24} lg={8}>
          <Panel>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "var(--av-text)",
                marginBottom: 13,
              }}
            >
              {i.slaTitle}
            </h4>
            {[
              { l: i.urgent, t: "< 1 hr", c: "#ef4444" },
              { l: i.high, t: "< 4 hrs", c: "#d97706" },
              { l: i.medium, t: "< 24 hrs", c: "#3b82f6" },
              { l: i.low, t: "< 72 hrs", c: "#546885" },
            ].map((r, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "9px 0",
                  borderBottom: "1px solid var(--av-border2)",
                }}
              >
                <PrTag priority={r.l.toLowerCase() as Priority} i={i} />
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--av-text3)",
                    fontFamily: "var(--av-font-mono)",
                  }}
                >
                  {r.t}
                </span>
              </div>
            ))}
          </Panel>
        </Col>
      </Row>
    </UserLayout>
  );
};

export default CreateTicket;