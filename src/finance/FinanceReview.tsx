import { useState } from "react";
import { FINANCE_REVIEW_MENU } from "../types";
import { BuddhistDatePicker } from "../BuddhistDatePicker";
import { DataTable, type DataTableColumn } from "../DataTable";
import type {
  ApprovalDetails,
  DemoUser,
  FinanceSummaryStat,
  RequestRecord,
} from "../types";
import { StatusBadge } from "../StatusBadge";
import {
  currentLocalISODate,
  fileSize,
  money,
} from "../utils";

type RequestDetailsProps = {
  request: RequestRecord;
  onClose: () => void;
  decisionRole?: string;
  onDecision?: (result: string, details: ApprovalDetails) => void;
  canSubmitSettlement?: boolean;
  onSubmitSettlement?: (reference: string, date: string) => void;
};

export function RequestDetails({
  request,
  onClose,
  decisionRole,
  onDecision,
  canSubmitSettlement,
  onSubmitSettlement,
}: RequestDetailsProps) {
  const [comment, setComment] = useState("");
  const [decisionError, setDecisionError] = useState("");
  const [revisionReason, setRevisionReason] = useState("");
  const [revisionError, setRevisionError] = useState("");
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentDate, setPaymentDate] = useState(currentLocalISODate());
  const [settlementReference, setSettlementReference] = useState("");
  const [settlementDate, setSettlementDate] = useState(currentLocalISODate());
  const [submittedReference, setSubmittedReference] = useState(
    request.settlementReference ?? "",
  );
  const [submittedDate, setSubmittedDate] = useState(
    request.submittedSettlementDate ?? currentLocalISODate(),
  );
  const history = request.approvalHistory ?? [];
  const attachments = request.attachments ?? [];
  const expenseItems = request.expenseItems ?? [];
  const recordingPayment =
    decisionRole === "finance" && request.status === "รอฝ่ายการเงิน";
  const clearingAdvance =
    decisionRole === "finance" && request.status === "รอตรวจเคลียร์เงินยืม";
  const submitRevision = () => {
    const reason = revisionReason.trim();
    if (!reason) {
      setRevisionError("กรุณาระบุเหตุผลในการส่งกลับแก้ไข");
      return;
    }
    onDecision?.("ส่งแก้ไข", {
      comment: reason,
      paymentReference: "",
      paymentDate: "",
      settlementReference: "",
      settlementDate: "",
    });
  };
  const decide = (result: string) => {
    if (!onDecision) return;
    if (["ส่งแก้ไข", "ไม่อนุมัติ"].includes(result) && !comment.trim()) {
      setDecisionError("กรุณาระบุเหตุผลสำหรับการส่งแก้ไขหรือไม่อนุมัติ");
      return;
    }
    if (recordingPayment && (!paymentReference.trim() || !paymentDate)) {
      setDecisionError("กรุณาระบุเลขอ้างอิงการจ่ายและวันที่จ่าย");
      return;
    }
    if (clearingAdvance && (!settlementReference.trim() || !settlementDate)) {
      setDecisionError("กรุณาระบุเลขที่หลักฐานเคลียร์เงินยืมและวันที่เคลียร์");
      return;
    }
    setDecisionError("");
    onDecision(result, {
      comment: comment.trim(),
      paymentReference: paymentReference.trim(),
      paymentDate,
      settlementReference: settlementReference.trim(),
      settlementDate,
    });
  };

  return (
    <div
      className="request-detail-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <article
        className="request-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-detail-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="request-detail-header">
          <div>
            <span>รายละเอียดคำขอ</span>
            <h2 id="request-detail-title">{request.title}</h2>
            <small>
              {request.code} • {request.date}
            </small>
          </div>
          <button type="button" aria-label="ปิดรายละเอียด" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="request-detail-body">
          <div className="request-detail-summary">
            <div>
              <span>ผู้ขอ</span>
              <strong>
                {request.requester} ({request.requesterRole})
              </strong>
            </div>
            <div>
              <span>หน่วยงาน</span>
              <strong>{request.unit}</strong>
            </div>
            <div>
              <span>ประเภทงบ</span>
              <strong>{request.category}</strong>
            </div>
            <div>
              <span>วงเงิน</span>
              <strong>{money(request.amount)}</strong>
            </div>
          </div>
          <section className="detail-field-grid">
            <div>
              <span>รูปแบบคำขอ</span>
              <strong>
                {request.requestType} • {request.requestTiming}
              </strong>
            </div>
            <div>
              <span>ปีงบประมาณ</span>
              <strong>{request.budgetYear}</strong>
            </div>
            <div>
              <span>วันที่ยื่นคำขอ</span>
              <strong>{request.requestDate}</strong>
            </div>
            <div>
              <span>วันที่ต้องการใช้</span>
              <strong>{request.neededDate}</strong>
            </div>
            <div>
              <span>ชื่อโครงการ</span>
              <strong>{request.projectName || "ไม่ใช่คำขอโครงการ"}</strong>
            </div>
            <div>
              <span>สถานะปัจจุบัน</span>
              <StatusBadge status={request.status} />
            </div>
          </section>
          <section>
            <span>เหตุผลความจำเป็น</span>
            <p>{request.description}</p>
          </section>
          {request.financeReferenceNo && (
            <section className="detail-field-grid">
              <div>
                <span>เลขอ้างอิงการเงิน</span>
                <strong>{request.financeReferenceNo}</strong>
              </div>
              <div>
                <span>กรอบการจ่าย</span>
                <strong>{request.financePurpose}</strong>
              </div>
            </section>
          )}
          {(request.paymentReference ||
            request.settlementReference ||
            request.settlementCloseReference) && (
            <section className="detail-field-grid">
              {request.paymentReference && (
                <div>
                  <span>เลขอ้างอิงการจ่าย</span>
                  <strong>
                    {request.paymentReference} • {request.paymentDate}
                  </strong>
                </div>
              )}
              {request.settlementReference && (
                <div>
                  <span>หลักฐานที่ผู้ขอส่ง</span>
                  <strong>
                    {request.settlementReference} •{" "}
                    {request.submittedSettlementDate}
                  </strong>
                </div>
              )}
              {request.settlementCloseReference && (
                <div>
                  <span>เลขอ้างอิงตรวจปิดเงินยืม</span>
                  <strong>
                    {request.settlementCloseReference} •{" "}
                    {request.actualSettlementDate}
                  </strong>
                </div>
              )}
            </section>
          )}
          <section>
            <span>รายการค่าใช้จ่าย</span>
            <div className="detail-expense-list">
              {expenseItems.map((item, index) => (
                <div key={`${item.name}-${index}`}>
                  <span>{index + 1}</span>
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.detail}</small>
                  </div>
                  <b>
                    {Number(
                      String(item.amount).replace(/,/g, "") || 0,
                    ).toLocaleString("th-TH")}{" "}
                    บาท
                  </b>
                </div>
              ))}
            </div>
          </section>
          <section className="detail-field-grid">
            <div>
              <span>ผู้รับเงิน</span>
              <strong>{request.recipientName}</strong>
            </div>
            <div>
              <span>เลขประจำตัวผู้เสียภาษี</span>
              <strong>{request.taxId}</strong>
            </div>
            <div>
              <span>ธนาคาร</span>
              <strong>{request.bankName}</strong>
            </div>
            <div>
              <span>เลขที่บัญชี</span>
              <strong>{request.accountNumber}</strong>
            </div>
            <div>
              <span>ชื่อบัญชี</span>
              <strong>{request.accountName}</strong>
            </div>
            {request.settlementDate && (
              <div>
                <span>
                  {request.requestType === "เงินสดยืม"
                    ? "กำหนดเคลียร์เงินยืม"
                    : "วันที่ชำระโดยประมาณ"}
                </span>
                <strong>{request.settlementDate}</strong>
              </div>
            )}
          </section>
          <section>
            <span>เอกสารประกอบ</span>
            <div className="detail-attachments">
              {attachments.map((item, index) => (
                <div key={`${item.name}-${index}`}>
                  <strong>{item.type}</strong>
                  <small>
                    {item.name} • {fileSize(item.size ?? 0)}
                  </small>
                </div>
              ))}
            </div>
          </section>
          <section>
            <span>ประวัติการพิจารณา</span>
            <div className="detail-history">
              {history.length > 0 ? (
                history.map((item, index) => (
                  <div key={`${item.step}-${index}`}>
                    <span>{index + 1}</span>
                    <div>
                      <strong>
                        {item.label ?? item.step} — {item.actor}
                      </strong>
                      <small>
                        {item.result} • {item.date}
                        {item.comment ? ` • หมายเหตุ: ${item.comment}` : ""}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <p>ยังไม่มีประวัติการอนุมัติ</p>
              )}
            </div>
          </section>
          <p className="demo-data-note">
            ข้อมูลผู้รับเงินและเอกสารในรายการนี้เป็นข้อมูลสมมติสำหรับทดสอบการแสดงผล
            ไม่ใช่ข้อมูลการเงินจริง
          </p>
        </div>
        {canSubmitSettlement && (
          <div className="request-decision-panel">
            <div className="approval-scope">
              <strong>รอส่งหลักฐานเคลียร์เงินยืม</strong>
              <span>
                กรอกเลขที่ใบสำคัญ/หลักฐานการคืนเงิน
                และวันที่ส่งให้ฝ่ายการเงินตรวจสอบ
              </span>
            </div>
            <div className="detail-field-grid">
              <label>
                <span>
                  เลขที่ใบสำคัญ/หลักฐาน <b>*</b>
                </span>
                <input
                  value={submittedReference}
                  onChange={(event) =>
                    setSubmittedReference(event.target.value)
                  }
                  placeholder="เช่น SET-2569-001"
                />
              </label>
              <label>
                <span>
                  วันที่ส่งหลักฐาน <b>*</b>
                </span>
                <BuddhistDatePicker
                  label="วันที่ส่งหลักฐาน"
                  value={submittedDate}
                  onChange={setSubmittedDate}
                />
              </label>
            </div>
            {decisionError && (
              <p className="decision-error" role="alert">
                {decisionError}
              </p>
            )}
            <div className="request-detail-actions">
              <button
                type="button"
                className="detail-approve"
                onClick={() => {
                  if (!submittedReference.trim() || !submittedDate) {
                    setDecisionError("กรุณาระบุเลขที่หลักฐานและวันที่ส่ง");
                    return;
                  }
                  onSubmitSettlement?.(
                    submittedReference.trim(),
                    submittedDate,
                  );
                }}
              >
                ส่งหลักฐานให้ฝ่ายการเงิน
              </button>
            </div>
          </div>
        )}
        {onDecision && (
          <div className="request-decision-panel">
            {(recordingPayment || clearingAdvance) && (
              <div className="detail-field-grid">
                {recordingPayment ? (
                  <>
                    <label>
                      <span>
                        เลขอ้างอิงการจ่ายเงิน <b>*</b>
                      </span>
                      <input
                        value={paymentReference}
                        onChange={(event) =>
                          setPaymentReference(event.target.value)
                        }
                        placeholder="เช่น PAY-2569-001"
                      />
                    </label>
                    <label>
                      <span>
                        วันที่จ่ายเงิน <b>*</b>
                      </span>
                      <BuddhistDatePicker
                        label="วันที่จ่ายเงิน"
                        value={paymentDate}
                        onChange={setPaymentDate}
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <label>
                      <span>
                        เลขที่ใบสำคัญ/หลักฐานเคลียร์เงินยืม <b>*</b>
                      </span>
                      <input
                        value={settlementReference}
                        onChange={(event) =>
                          setSettlementReference(event.target.value)
                        }
                        placeholder="เช่น SET-2569-001"
                      />
                    </label>
                    <label>
                      <span>
                        วันที่เคลียร์เงินยืม <b>*</b>
                      </span>
                      <BuddhistDatePicker
                        label="วันที่เคลียร์เงินยืม"
                        value={settlementDate}
                        onChange={setSettlementDate}
                      />
                    </label>
                  </>
                )}
              </div>
            )}
            <label className="decision-comment">
              <span>
                หมายเหตุ / เหตุผล
                {!recordingPayment &&
                  !clearingAdvance &&
                  " (ต้องระบุเมื่อส่งแก้ไขหรือไม่อนุมัติ)"}
              </span>
              <textarea
                rows={3}
                value={comment}
                onChange={(event) => {
                  setComment(event.target.value);
                  setDecisionError("");
                }}
                placeholder="ระบุข้อพิจารณา หรือเอกสารที่ต้องแก้ไข"
              />
            </label>
            {decisionError && (
              <p className="decision-error" role="alert">
                {decisionError}
              </p>
            )}
            <div className="request-detail-actions">
              {clearingAdvance ? (
                <button
                  type="button"
                  className="detail-approve"
                  onClick={() => decide("ปิดเงินยืม")}
                >
                  ยืนยันปิดรายการเงินยืม
                </button>
              ) : recordingPayment ? (
                <button
                  type="button"
                  className="detail-approve"
                  onClick={() => decide("อนุมัติแล้ว")}
                >
                  บันทึกการจ่ายเงิน
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="detail-reject"
                    onClick={() => decide("ไม่อนุมัติ")}
                  >
                    ไม่อนุมัติ
                  </button>
                  <button
                    type="button"
                    className="detail-revise"
                    onClick={() => decide("ส่งแก้ไข")}
                  >
                    ส่งแก้ไข
                  </button>
                  <button
                    type="button"
                    className="detail-approve"
                    onClick={() => decide("อนุมัติแล้ว")}
                  >
                    อนุมัติคำขอ
                  </button>
                </>
              )}
              {(recordingPayment || clearingAdvance) && (
                <button
                  type="button"
                  className="detail-revise"
                  onClick={() => {
                    setRevisionReason("");
                    setRevisionError("");
                    setShowRevisionModal(true);
                  }}
                >
                  ส่งกลับแก้ไข
                </button>
              )}
            </div>
          </div>
        )}
      </article>
      {showRevisionModal && (
        <div
          className="request-detail-backdrop revision-confirm-backdrop"
          role="presentation"
          onClick={() => setShowRevisionModal(false)}
        >
          <article
            className="request-detail-modal revision-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="revision-confirm-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="request-detail-header">
              <div>
                <span>ส่งกลับแก้ไข</span>
                <h2 id="revision-confirm-title">ระบุเหตุผลที่ต้องแก้ไข</h2>
              </div>
              <button
                type="button"
                aria-label="ปิดหน้าต่างส่งกลับแก้ไข"
                onClick={() => setShowRevisionModal(false)}
              >
                ×
              </button>
            </div>
            <div className="revision-confirm-body">
              <label className="decision-comment">
                <span>
                  เหตุผล <b>*</b>
                </span>
                <textarea
                  rows={4}
                  required
                  autoFocus
                  value={revisionReason}
                  onChange={(event) => {
                    setRevisionReason(event.target.value);
                    setRevisionError("");
                  }}
                  placeholder="ระบุเอกสารหรือข้อมูลที่ผู้ขอต้องแก้ไข"
                />
              </label>
              {revisionError && (
                <p className="decision-error" role="alert">
                  {revisionError}
                </p>
              )}
            </div>
            <div className="request-detail-actions">
              <button
                type="button"
                className="detail-revise-cancel"
                onClick={() => setShowRevisionModal(false)}
              >
                ยกเลิก
              </button>
              <button
                type="button"
                className="detail-revise"
                disabled={!revisionReason.trim()}
                onClick={submitRevision}
              >
                ยืนยันส่งกลับแก้ไข
              </button>
            </div>
          </article>
        </div>
      )}
    </div>
  );
}

type FinanceReviewProps =
  | {
      mode: "summary";
      approvalCandidates: RequestRecord[];
      allRequests: RequestRecord[];
      myRequests: RequestRecord[];
    }
  | {
      mode: "review";
      active: string;
      user: DemoUser;
      approvalCandidates: RequestRecord[];
      approvalScopeDescription: string;
      message: string;
      selectedRequest: RequestRecord | null;
      approvalOverrides: Record<string, string>;
      onSelectRequest: (request: RequestRecord | null) => void;
      onDecision: (
        code: string,
        result: string,
        details: ApprovalDetails,
      ) => void;
    };

const thaiMonths: Record<string, number> = {
  "ม.ค.": 1,
  "ก.พ.": 2,
  "มี.ค.": 3,
  "เม.ย.": 4,
  "พ.ค.": 5,
  "มิ.ย.": 6,
  "ก.ค.": 7,
  "ส.ค.": 8,
  "ก.ย.": 9,
  "ต.ค.": 10,
  "พ.ย.": 11,
  "ธ.ค.": 12,
};

const dateTimestamp = (value?: string) => {
  if (!value) return null;
  const isoDate = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoDate) {
    const [, year, month, day] = isoDate;
    return Date.UTC(Number(year), Number(month) - 1, Number(day));
  }
  const thaiDate = value.match(/^(\d{1,2})\s+([ก-๙.]+)\s+(\d{4})/);
  const numericDate = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  const match = thaiDate ?? numericDate;
  if (!match) return null;
  const day = Number(match[1]);
  const month = thaiDate ? thaiMonths[match[2]] : Number(match[2]);
  const inputYear = Number(match[3]);
  const year = inputYear > 2400 ? inputYear - 543 : inputYear;
  if (!month || month > 12 || day > 31) return null;
  return Date.UTC(year, month - 1, day);
};

export function FinanceReview(props: FinanceReviewProps) {
  const [advanceTab, setAdvanceTab] = useState<
    "awaiting-clearance" | "ready-for-review"
  >("awaiting-clearance");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  if (props.mode === "summary") {
    const stats: FinanceSummaryStat[] = [
      [
        "รอตรวจสอบการเงิน",
        `${props.approvalCandidates.filter((item) => item.status === "รอฝ่ายการเงิน").length} รายการ`,
        "ทุกหน่วยงาน",
      ],
      [
        "วงเงินรอตรวจ",
        money(
          props.approvalCandidates.reduce(
            (total, item) => total + Number(item.amount || 0),
            0,
          ),
        ),
        "รวมเฉพาะคิวการเงิน",
      ],
      [
        "รอตรวจหลักฐานเงินยืม",
        `${props.allRequests.filter((item) => item.status === "รอตรวจเคลียร์เงินยืม").length} รายการ`,
        "ติดตามหลักฐาน",
      ],
      [
        "คำขอของฉันเสร็จแล้ว",
        `${props.myRequests.filter((item) => ["อนุมัติแล้ว", "ชำระเงินแล้ว", "ปิดรายการแล้ว"].includes(item.status)).length} รายการ`,
        "ผู้ขอฝ่ายการเงิน",
      ],
    ];

    return (
      <section className="stats-grid">
        {stats.map((stat, index) => (
          <article className="stat-card" key={stat[0]}>
            <div className={`stat-icon color-${index}`}>
              {["▦", "✓", "↻", "฿"][index]}
            </div>
            <div>
              <p>{stat[0]}</p>
              <strong>{stat[1]}</strong>
              <small>{stat[2]}</small>
            </div>
          </article>
        ))}
      </section>
    );
  }
  const borrowedTracking = props.active === FINANCE_REVIEW_MENU[1];
  const requests = borrowedTracking
    ? props.approvalCandidates.filter((item) =>
        advanceTab === "awaiting-clearance"
          ? item.status === "รอเคลียร์เงินยืม"
          : item.status === "รอตรวจเคลียร์เงินยืม",
      )
    : props.approvalCandidates;
  const todayTimestamp = dateTimestamp(currentLocalISODate());
  const waitingDays = (request: RequestRecord) => {
    const latestHistoryDate = request.approvalHistory?.at(-1)?.date;
    const startTimestamp =
      dateTimestamp(latestHistoryDate) ??
      dateTimestamp(request.requestDate) ??
      dateTimestamp(request.date);
    if (startTimestamp === null || todayTimestamp === null) return null;
    return Math.max(
      0,
      Math.floor((todayTimestamp - startTimestamp) / 86_400_000),
    );
  };
  const departments = [...new Set(requests.map((item) => item.unit))].sort(
    (a, b) => a.localeCompare(b, "th"),
  );
  const departmentFilteredRequests = requests.filter(
    (item) => !selectedDepartment || item.unit === selectedDepartment,
  );
  const overdueDays = (dueDate?: string) => {
    if (!dueDate || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) return null;
    const [year, month, day] = dueDate.split("-").map(Number);
    const due = Date.UTC(year, month - 1, day);
    const [todayYear, todayMonth, todayDay] = currentLocalISODate().split("-").map(Number);
    const today = Date.UTC(todayYear, todayMonth - 1, todayDay);
    if (Number.isNaN(due) || Number.isNaN(today)) return null;
    return Math.max(0, Math.floor((today - due) / 86_400_000));
  };
  const formatDueDate = (dueDate?: string) => {
    if (!dueDate || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) return "ไม่ระบุ";
    const [year, month, day] = dueDate.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("th-TH");
  };
  const sortedRequests = borrowedTracking && advanceTab === "awaiting-clearance"
    ? [...departmentFilteredRequests].sort((a, b) => (overdueDays(b.settlementDate) ?? -1) - (overdueDays(a.settlementDate) ?? -1))
    : borrowedTracking
      ? departmentFilteredRequests
      : [...departmentFilteredRequests].sort((a, b) => (waitingDays(b) ?? -1) - (waitingDays(a) ?? -1));
  const tableColumns: DataTableColumn<RequestRecord>[] = [
    { key: "code", header: "เลขที่คำขอ", render: (item) => <><strong>{item.code}</strong><small>{item.date}</small></>, sortValue: (item) => item.code, searchValue: (item) => `${item.code} ${item.date}` },
    { key: "title", header: "รายการ", render: (item) => <><strong>{item.title}</strong><small>{item.requester}</small></>, sortValue: (item) => item.title, searchValue: (item) => `${item.title} ${item.requester}` },
    { key: "unit", header: "หน่วยงาน", render: (item) => item.unit, sortValue: (item) => item.unit },
    { key: "amount", header: "วงเงิน", render: (item) => money(item.amount), sortValue: (item) => Number(item.amount) || 0 },
    ...(!borrowedTracking ? [
      { key: "type", header: "ประเภท", render: (item: RequestRecord) => <span className={`request-type-badge ${item.requestType === "เงินสดยืม" ? "cash-advance" : "reimbursement"}`}>{item.requestType ?? "เบิกจ่าย"}</span>, sortValue: (item: RequestRecord) => item.requestType ?? "เบิกจ่าย", searchValue: (item: RequestRecord) => item.requestType ?? "เบิกจ่าย" },
      { key: "waiting", header: "รอมาแล้วกี่วัน", render: (item: RequestRecord) => waitingDays(item) ?? "—", sortValue: (item: RequestRecord) => waitingDays(item) },
    ] : advanceTab === "awaiting-clearance" ? [
      { key: "dueDate", header: "กำหนดเคลียร์", render: (item: RequestRecord) => formatDueDate(item.settlementDate), sortValue: (item: RequestRecord) => item.settlementDate ?? null },
      { key: "overdue", header: "เกินกำหนด (วัน)", render: (item: RequestRecord) => overdueDays(item.settlementDate) ?? "—", sortValue: (item: RequestRecord) => overdueDays(item.settlementDate) },
    ] : []),
    { key: "actions", header: "การดำเนินการ", searchValue: () => "", render: (item) => <div className="approval-actions"><button type="button" className="view-detail" onClick={() => props.onSelectRequest(item)}>ดูรายละเอียดและดำเนินการ</button></div> },
  ];
  return (
    <section className="approval-page panel">
      <div className="panel-header">
        <div>
          <h2>
            {borrowedTracking
              ? "รายการรอเคลียร์เงินยืม"
              : "คิวตรวจสอบการจ่ายเงิน"}
          </h2>
          <p>
            {borrowedTracking
              ? "ตรวจหลักฐานการเคลียร์เงินยืมและปิดรายการ"
              : "ตรวจคำขอที่ผ่านการอนุมัติและดำเนินการจ่ายเงิน"}
          </p>
        </div>
      </div>
      {props.message && (
        <div className="form-message approval-message" role="status">
          {props.message}
        </div>
      )}
      <div className="approval-scope">
        <strong>ขอบเขตสิทธิ์: {props.user.label}</strong>
        <span>
          {borrowedTracking
            ? "ฝ่ายการเงินตรวจหลักฐานการเคลียร์เงินยืมและปิดรายการหลังผู้ขอชำระคืน"
            : props.approvalScopeDescription}
        </span>
      </div>
      {borrowedTracking && (
        <div className="advance-tracking-tabs" role="tablist" aria-label="ตัวกรองสถานะเงินยืม">
          <button
            type="button"
            role="tab"
            aria-selected={advanceTab === "awaiting-clearance"}
            className={advanceTab === "awaiting-clearance" ? "active" : ""}
            onClick={() => {
              setAdvanceTab("awaiting-clearance");
              props.onSelectRequest(null);
            }}
          >
            จ่ายแล้ว รอผู้ขอเคลียร์
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={advanceTab === "ready-for-review"}
            className={advanceTab === "ready-for-review" ? "active" : ""}
            onClick={() => {
              setAdvanceTab("ready-for-review");
              props.onSelectRequest(null);
            }}
          >
            รอตรวจเคลียร์
          </button>
        </div>
      )}
      {!borrowedTracking && (
        <div className="finance-queue-filters">
          <label>
            <span className="visually-hidden">กรองตามหน่วยงาน</span>
            <select
              value={selectedDepartment}
              onChange={(event) => setSelectedDepartment(event.target.value)}
            >
              <option value="">ทุกหน่วยงาน</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      <DataTable
        key={borrowedTracking ? advanceTab : "payment-review"}
        rows={sortedRequests}
        columns={tableColumns}
        getRowKey={(item) => item.code}
        emptyMessage={borrowedTracking
          ? "ไม่มีรายการในตัวกรองนี้"
          : "ไม่มีคำขออยู่ในขอบเขตอำนาจของคุณในขณะนี้"}
        searchPlaceholder="ค้นหาเลขที่ รายการ ผู้ขอ หรือหน่วยงาน"
        rowClassName={(item) =>
          advanceTab === "awaiting-clearance" &&
          (overdueDays(item.settlementDate) ?? 0) > 0
            ? "advance-overdue-row"
            : undefined
        }
      />
      {props.selectedRequest && (
        <RequestDetails
          request={{
            ...props.selectedRequest,
            status:
              props.approvalOverrides[props.selectedRequest.code] ??
              props.selectedRequest.status,
          }}
          onClose={() => props.onSelectRequest(null)}
          decisionRole={props.user.id}
          {...(props.selectedRequest.status === "รอตรวจเคลียร์เงินยืม"
            ? {
                onDecision: (result: string, details: ApprovalDetails) =>
                  props.onDecision(props.selectedRequest!.code, result, details),
              }
            : {})}
        />
      )}
    </section>
  );
}
