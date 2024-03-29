import React, { Component } from "react";
import { connect } from "react-redux";
import "./HotpotExtraInfo.scss";
import Select from "react-select";
import moment from "moment";
import localization from "moment/locale/vi";
import { LANGUAGES } from "../../../utils";
import {
  getExtraInfoHotpotById,
  getDetailInfoHotpot,
} from "../../../services/hotpotService";
import { FormattedMessage } from "react-intl";
import NumberFormat from "react-number-format";

class HotpotExtraInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDetailInfo: false,
      extraInfo: {},
    };
  }

  async componentDidMount() {
    if (this.props.hotpotIdFromParent) {
      let res = await getExtraInfoHotpotById(this.props.hotpotIdFromParent);
      console.log(
        "this.props.hotpotIdFromParent extra",
        this.props.hotpotIdFromParent
      );
      if (res && res.errCode === 0) {
        this.setState({
          extraInfo: res.data,
        });
      }
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.hotpotIdFromParent !== prevProps.hotpotIdFromParent) {
      let res = await getExtraInfoHotpotById(this.props.hotpotIdFromParent);
      if (res && res.errCode === 0) {
        this.setState({
          extraInfo: res.data,
        });
      }
    }
  }

  showHideDetailInfo = (status) => {
    this.setState({
      isShowDetailInfo: status,
    });
  };

  render() {
    let { isShowDetailInfo, extraInfo } = this.state;
    let { language } = this.props;
    return (
      <div className="hotpot-extra-info-container">
        <div className="content-up">
          <div className="text-address">
            {" "}
            <FormattedMessage id="customer.extra-info-hotpot.text-address" />
          </div>
          <div className="name-restaurant">
            {extraInfo && extraInfo.Restaurant ? extraInfo.Restaurant.name : ""}
          </div>
          <div className="address-restaurant">
            {extraInfo && extraInfo.Restaurant
              ? extraInfo.Restaurant.address
              : ""}
          </div>
        </div>
        <div className="content-down">
          {isShowDetailInfo === false && (
            <div className="short-info">
              <span className="price">
                <FormattedMessage id="customer.extra-info-hotpot.price" />{" "}
              </span>

              {extraInfo &&
                extraInfo.priceData &&
                language === LANGUAGES.VI && (
                  <NumberFormat
                    className="currency"
                    value={extraInfo.priceData.valueVi}
                    displayType={"text"}
                    thousandSeparator={true}
                    suffix={"VND"}
                  />
                )}
              {extraInfo &&
                extraInfo.priceData &&
                language === LANGUAGES.EN && (
                  <NumberFormat
                    className="currency"
                    value={extraInfo.priceData.valueEn}
                    displayType={"text"}
                    thousandSeparator={true}
                    suffix={"$"}
                  />
                )}
              <span
                className="detail"
                onClick={() => this.showHideDetailInfo(true)}
              >
                {" "}
                <FormattedMessage id="customer.extra-info-hotpot.detail" />
              </span>
            </div>
          )}
          {isShowDetailInfo === true && (
            <>
              <div className="title-price">
                <FormattedMessage id="customer.extra-info-hotpot.price" />
              </div>
              <div className="detail-info">
                <div className="price">
                  <span className="left">
                    <FormattedMessage id="customer.extra-info-hotpot.price" />
                  </span>
                  <span className="right">
                    {" "}
                    {extraInfo &&
                      extraInfo.priceData &&
                      language === LANGUAGES.VI && (
                        <NumberFormat
                          className="currency"
                          value={extraInfo.priceData.valueVi}
                          displayType={"text"}
                          thousandSeparator={true}
                          suffix={"VND"}
                        />
                      )}
                    {extraInfo &&
                      extraInfo.priceData &&
                      language === LANGUAGES.EN && (
                        <NumberFormat
                          className="currency"
                          value={extraInfo.priceData.valueEn}
                          displayType={"text"}
                          thousandSeparator={true}
                          suffix={"$"}
                        />
                      )}
                  </span>
                </div>
                <div className="note">
                  {extraInfo && extraInfo.note ? extraInfo.note : ""}
                </div>
              </div>

              <div className="payment">
                <FormattedMessage id="customer.extra-info-hotpot.payment" />
                {extraInfo && extraInfo.paymentData && language === LANGUAGES.VI
                  ? extraInfo.paymentData.valueVi
                  : ""}
                {extraInfo && extraInfo.paymentData && language === LANGUAGES.EN
                  ? extraInfo.paymentData.valueEn
                  : ""}
              </div>
              <div className="hide-price">
                <span onClick={() => this.showHideDetailInfo(false)}>
                  <FormattedMessage id="customer.extra-info-hotpot.hide-price" />
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HotpotExtraInfo);
